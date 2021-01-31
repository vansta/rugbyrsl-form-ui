<template>
  <v-container>
    <v-tabs grow v-model="selectedAgeGroupIndex" dark @change="getTrainings">
      <v-tab v-for="ageGroup in ageGroups" :key="ageGroup.id">{{ ageGroup.name }}</v-tab>
    </v-tabs>
    <v-data-table
      :headers="headers"
      :items="trainings"
    >
      <template v-slot:item.register="{ item }">
        <v-btn icon>
          <v-icon @click="register(item)">
            mdi-rugby
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <span class="text-h5">
      {{ selectedTraining.dateString }}
    </span>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="registry.playerName" label="Naam" clearable></v-text-field>
      </v-col>
      <v-col>
        <v-textarea v-model="registry.remark" label="Opmerking">

        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-btn block color="primary" @click="postRegistry" :disabled="Object.keys(selectedTraining).length === 0">
        Inschrijven
      </v-btn>
    </v-row>
    <v-snackbar v-model="snackbar.on" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
  
</template>

<script>
  export default {
    name: 'Trainings',
    computed: {
      selectedAgeGroupId() {
        if (this.ageGroups.length > 0){
          return this.ageGroups[this.selectedAgeGroupIndex].id
        }
        else{
          return null
        }
      }
    },
    methods: {
      register(training){
        this.selectedTraining = Object.assign({}, training)
      },



      getTrainings(){
        this.$api.getTrainings(this.selectedAgeGroupId)
          .then(resp => this.trainings = resp.data)
      },
      getAgeGroups(){
        this.$api.getAgeGroups()
          .then(resp => this.ageGroups = resp.data)
      },
      postRegistry(){
        this.registry.trainingId = this.selectedTraining.id
        this.$api.postRegistry(this.registry)
          .then(resp => {
            this.snackbar = {
              on: true,
              color: 'success',
              message: resp.data
            }
            this.getTrainings()
          })
          .catch(err => {
            this.snackbar = {
              on: true,
              color: 'error',
              message: err.response.data
            }
          })
      }
    },

    data: () => ({
      headers: [
        {
          text: "Datum",
          value: "dateString"
        },
        {
          text: "Beschikbare plaatsen",
          value: "availableSpaces"
        },
        {
          text: "Groep",
          value: "ageGroup"
        },
        {
          text: "Inschrijven",
          value: 'register'
        }
      ],
      trainings: [],
      registry: {},
      ageGroups: [],
      selectedAgeGroupIndex: 0,
      selectedTraining: {},
      snackbar: {}
    }),
    mounted() {
      this.getAgeGroups()
      this.getTrainings()
    }
  }
</script>
