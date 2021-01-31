<template>
  <v-container class="mt-16">
    <v-card>
      <v-card-text>
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
      </v-card-text>
    </v-card>
    
    <v-card v-if="trainingSelected">
      <v-card-text>
        <span class="text-h5">
          {{ selectedTraining.dateString }}
        </span>
        <v-form v-model="valid" ref="form">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="registry.playerName" label="Naam" clearable :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col>
              <v-textarea v-model="registry.remark" label="Opmerking"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-btn block color="primary" @click="postRegistry" :disabled="!trainingSelected || !valid">
              Inschrijven
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
      
    </v-card>
    
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
      },
      trainingSelected() {
        return Object.keys(this.selectedTraining).length !== 0
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
        this.$refs.form.validate()
        if (this.valid){
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
      }
    },

    data: () => ({
      headers: [
        {
          text: "Groep",
          value: "ageGroup"
        },
        {
          text: "Datum",
          value: "dateString"
        },
        {
          text: "Start",
          value: "startTime"
        },
        {
          text: "Einde",
          value: "endTime"
        },
        {
          text: "Beschikbare plaatsen",
          value: "availableSpaces"
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
      snackbar: {},
      rules: {
        required: value => !!value || "Verplicht veld"
      },
      valid: false
    }),
    mounted() {
      this.getAgeGroups()
      this.getTrainings()
    }
  }
</script>
