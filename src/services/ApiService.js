import axios from '../../node_modules/axios'
import settings from '../settings'

const api = axios.create({
    baseURL: settings.baseURL
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
    getRegistries(trainingId){
        return api.get('training/registries', {
            params: {
                trainingId
            }
        })
    },

    //POST
    postRegistry(registry){
        return api.post('training', registry)
    },
    postNewTrainings(newTrainings){
        return api.post('training/newtraining', newTrainings)
    },

    //DELETE
    deleteTraining(trainingId){
        return api.delete('training', {
            params: {
                trainingId
            }
        })
    },
    deleteRegistry(registryId){
        return api.delete('training/registries', {
            params: {
                registryId
            }
        })
    }
}