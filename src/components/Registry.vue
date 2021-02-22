<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-tabs grow v-model="selectedAgeGroupIndex" dark @change="initAgeGroup" show-arrows center-active>
          <v-tab v-for="ageGroup in ageGroups" :key="ageGroup.id">{{ ageGroup.name }}</v-tab>
        </v-tabs>
        <v-data-table
          :loading="tableLoading"
          :headers="headers"
          :items="trainings"
          item-key="id"
          @click:row="register"
          @item-expanded="getRegistrations"
          show-expand
          single-expand
        >
          <template v-slot:item.register="{ item }">
            <v-btn icon depressed>
              <v-icon @click="register(item)" :disabled="item.availableSpaces <= 0 " large>
                mdi-rugby
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">
              <v-row v-for="registration in registrationsForExpanded" :key="registration.id" dense>
                <v-col cols="6" md="4" class="text-overline text-break font-weight-bold">
                  {{ registration.name }}
                </v-col>
                <v-col cols="6" md="8" class="text-body2 text-capitalize text-break">
                  {{ registration.remark }}
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    <v-dialog v-model="registerDialog">
      <v-card>
        <v-card-title class="text-uppercase">
          {{ selectedTraining.dateString }}
        </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-row>
            <v-col cols="12">
              <v-combobox v-model="registry.playerName" label="Naam" clearable :rules="[rules.required]" :items="players"></v-combobox>
              <!-- <v-text-field v-model="registry.playerName" label="Naam" clearable :rules="[rules.required]"></v-text-field> -->
            </v-col>
            <v-col>
              <v-textarea v-model="registry.remark" label="Opmerking"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-btn block color="primary" @click="postRegistry" :disabled="!trainingSelected || !valid" :loading="registerLoading">
              Inschrijven
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
      
    </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar.on" :color="snackbar.color" timeout="5000" top>
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
    watch: {
      selectedTraining: {
        handler() {
          this.registerDialog = Object.keys(this.selectedTraining).length > 0
        }
      }
    },
    methods: {
      initAgeGroup(){
        this.getTrainings()
        this.getPlayers()
      },
      register(training){
        if (training.availableSpaces > 0)
        this.selectedTraining = Object.assign({}, training)
      },
      getTrainings(){
        this.tableLoading = true
        this.$api.getTrainings(this.selectedAgeGroupId)
          .then(resp => this.trainings = resp.data)
          .finally(() => this.tableLoading = false)
      },
      getPlayers() {
        this.$api.getPlayers(this.selectedAgeGroupId)
          .then(resp => this.players = resp.data)
      },
      getAgeGroups(){
        this.$api.getAgeGroups()
          .then(resp => this.ageGroups = resp.data)
          .then(() => this.initAgeGroup())
      },
      postRegistry(){
        this.$refs.form.validate()
        if (this.valid){
          this.registerLoading = true
          this.registry.trainingId = this.selectedTraining.id
          this.$api.postRegistry(this.registry)
            .then(resp => {
              this.snackbar = {
                on: true,
                color: 'success',
                message: resp.data
              }
              this.registerDialog = false
              this.getTrainings()
            })
            .catch(err => {
              this.snackbar = {
                on: true,
                color: 'error',
                message: err.response ? err.response.data : err
              }
            })
            .finally(() => this.registerLoading = false)
        }
      },
      getRegistrations(expanded){
        if (expanded.value) {
          this.$api.getRegistries(expanded.item.id)
            .then(resp => this.registrationsForExpanded = resp.data)
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
      valid: false,
      registerDialog: false,
      players: [],
      registerLoading: false,
      tableLoading: false,
      registrationsForExpanded: []
    }),
    mounted() {
      this.getAgeGroups()
    }
  }
</script>
