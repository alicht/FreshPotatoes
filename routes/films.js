 const express = require('express');
 const models = require('../models');
 const router = express.Router();
 const axios = require('axios');
 const moment = require('moment');
 const REVIEWS_API_URL = 'http://credentials-api.generalassemb.ly';
 const REVIEWS_API_PATH = '/4576f55f-c427-4cfc-a11c-5bfe914ca6c1';
 const MIN_NUM_REVIEWS = 5; 
 const AVG_RATING_REC = 4.0; 
 const YEARS_BEFORE_REC = 15; 
 const YEARS_AFTER_REC = 15; 
 
 const request = axios.create({
   baseURL: REVIEWS_API_URL
 });
 
 function getReviewsForFilms(filmIds) {
   if (typeof filmIds !== 'number' && typeof filmIds !== 'string' && !Array.isArray(filmIds)) {
     throw new Error('film cannot be found');
   }
 
   return request.get(REVIEWS_API_PATH, {
     params: {
       films: Array.isArray(filmIds) ? filmIds.join(',') : filmIds
     }
   })
     .then(res => res.data);
 }

 router.get('/:id/recommendations', getFilmRecommendations);
 
 function getFilmRecommendations(req, res) {
   const filmId = req.params.id;
     const meta = Object.assign({
     offset: 1,
     limit: 10
   }, req.query);
 
   models.Film.findById(filmId)
     .then(film => {
       if (film) {
         return models.Film.findAll({
           where: {
             id: {
               $ne: film.id
             },
             genre_id: film.genre_id,
           },
           order: [ 'id' ]
         })

           .then(candidates => candidates.filter(cand => {
             const start = moment(film.releaseDate).subtract(YEARS_BEFORE_REC, 'years');
             const end = moment(film.releaseDate).add(YEARS_AFTER_REC, 'years');
             return moment(cand.releaseDate).isBetween(start, end, 'year');
           }))

           .then(candidates => {
             const candidateIds = candidates.map(cand => cand.id);
             return getReviewsForFilms(candidateIds)
               .then(reviews => {
                 return reviews
                   .filter(r => r.reviews.length >= MIN_NUM_REVIEWS )
                   .filter(r => {
                     const total = r.reviews.reduce((sum, cur) => sum + cur.rating, 0);
                     return (total / r.reviews.length) > AVG_RATING_REC;
                   })
               })
           })
      
       } else {
         res.status(404).json({ message: `Film id ${filmId} cannot be not found.` });
       }
     })

        .then(recommendations => res.json({
       recommendations,
       meta
     }))

     .catch(err => {
       if (err.response) {
         res.status(err.response.status).json({ message: err.message });
       } else {
         res.status(500).json({ message: err.message });
       }
     });
 }
 
 module.exports = router;