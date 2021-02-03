const { generateQuery ,asyncQuery } = require("../helpers/queryHelp")
const db = require('../database')

module.exports = {
    getAllMovies : async (req, res) => {
        try {
            const getAllMovies = `select name, release_date, release_month, release_year, duration_min, genre, description, ms.status, location, time from schedules s
                                  join locations l
                                  on s.location_id = l.id
                                  join show_times st
                                  on s.time_id = st.id
                                  join movies m
                                  on s.movie_id = m.id
                                  join movie_status ms
                                  on m.status = ms.id`
            const result = await asyncQuery(getAllMovies)

            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err)
        }
    },

    getMoviesByQuery : async (req, res) => {
        try{
            const getMovies = `select name, release_date, release_month, release_year, duration_min, genre, description, ms.status, location, time from schedules s
                               join locations l
                               on s.location_id = l.id
                               join show_times st
                               on s.time_id = st.id
                               join movies m
                               on s.movie_id = m.id
                               join movie_status ms
                               on m.status = ms.id
                               where ms.status = ${db.escape(req.query.status)}
                               or location = ${db.escape(req.query.location)}
                               or time = ${db.escape(req.query.time)}`
            const result = await asyncQuery(getMovies)

            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err)
        }
    },

    addMovies : async (req, res) => {
        const { name, genre, release_date, release_month, release_year, duration_min, description } = req.body

        try {
            const addMovies = `INSERT INTO movies ( name, genre, release_date, release_month, release_year, duration_min, description ) 
                               VALUES (${db.escape(name)}, ${db.escape(genre)}, ${db.escape(release_date)}, ${db.escape(release_month)}, ${db.escape(release_year)}, ${db.escape(duration_min)}, ${db.escape(description)})`
            const result = await asyncQuery(addMovies)
            console.log('ini result add:', result)

            res.status(200).send("berhasil add")
        }
        catch (err) {
            res.status(400).send(err)
        }
    },

    editStatus : async (req, res) => {
        try{
            if (req.user.role === 2) return res.status(400).send('sorry you are not admin')
            
            const editStatus = `UPDATE movies SET status = ${db.escape(req.body.status)} WHERE id = ${db.escape(req.params.id)}`
            const result = await asyncQuery(editStatus)
            
            result.message = 'status has been changed.'

            res.status(200).send(result) 
        }
        catch (err) {
            res.status(400).send(err) 
        }
    },

    setSchedule : async (req, res) => {
        try {
            if (req.user.role === 2) return res.status(400).send('sorry you are not admin')

            const setSchedule = `UPDATE schedules SET location_id = ${db.escape(req.body.location_id)}, time_id = ${db.escape(req.body.time_id)} WHERE movie_id = ${req.params.id}`
            const result = await asyncQuery(setSchedule)

            result.message = 'schedule has been added'

            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err) 
        }
    }
}