import axios from '../../node_modules/axios'
import settings from '../settings'

const api = axios.create({
    baseURL: settings.baseURL
    // baseURL: 'http://161.97.179.116:5006/api'
    // baseURL: 'https://localhost:44352/api'
})

export default{
    //GET 
    getTrainings(ageGroupId){
        return api.get('training', {
            params: {
                ageGroupId
            }
        })
    },
    getAgeGroups(){
        return api.get('agegroups')
    },
    getPlayers(ageGroupId){
        return api.get('player', {
            params: {
                ageGroupId
            }
        })
    },

    //POST
    postRegistry(registry){
        return api.post('training', registry)
    },
    postNewTrainings(newTrainings){
        return api.post('training/newtraining', newTrainings)
    }
}