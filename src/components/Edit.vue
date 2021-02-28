<template>
  <v-container>
    <v-snackbar v-model="snackbar.open" top :color="snackbar.type">
      {{ snackbar.text }}
    </v-snackbar>
    <v-card>
      <v-card-text>
        <v-tabs grow v-model="selectedAgeGroupIndex" dark @change="getTrainings" show-arrows center-active>
          <v-tab v-for="ageGroup in ageGroups" :key="ageGroup.id">{{ ageGroup.name }}</v-tab>
        </v-tabs>
        <v-data-table
          :headers="headers"
          :items="trainings"
          item-key="id"
          @item-expanded="showRegistries"
          show-expand
          single-expand
          :custom-sort="customSort"
          sort-by="dateString"
        >
          <template v-slot:item.delete="{ item }">
            <v-btn icon @click.stop="deleteTraining(item)">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="grey lighten-3">
              <v-card v-for="registration in registries" :key="registration.id" class="my-2 px-2">
                <v-row dense>
                  <v-col cols="5" md="4" class="text-overline text-break font-weight-bold">
                    {{ registration.name }}
                  </v-col>
                  <v-col cols="5" md="7" class="text-body2 text-capitalize text-break">
                    {{ registration.remark }}
                  </v-col>
                  <v-col cols="2" md="1">
                    <v-btn icon @click="deleteRegistry(registration, item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-form v-model="valid">
      <v-row>
        <v-col cols="4" sm="2">
          <v-menu v-model="startTimeMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" v-model="newTrainingsModel.startTime" readonly label="Start uur" :rules="[rules.required]"></v-text-field>
            </template>
            <v-time-picker format="24hr" v-model="newTrainingsModel.startTime"></v-time-picker>
          </v-menu>
          
        </v-col>
        <v-col cols="4" sm="2">
          <v-menu v-model="endTimeMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field v-on="on" v-model="newTrainingsModel.endTime" readonly label="Eind uur" :rules="[rules.required]"></v-text-field>
            </template>
            <v-time-picker format="24hr" v-model="newTrainingsModel.endTime"></v-time-picker>
          </v-menu>
          
        </v-col>
        <v-col cols="4" sm="2">
          <v-text-field type="number" v-model="newTrainingsModel.maxRegistries" :value="10" label="Maximum spelers"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-date-picker full-width multiple v-model="newTrainingsModel.dates"></v-date-picker>
        </v-col>
      </v-row>
    </v-form>
    
    <v-btn block color="primary" @click="postNewTrainings" :loading="loading" :disabled="!valid">Trainingen toevoegen</v-btn>

    <confirmation-dialog ref="confirm" />
    
  </v-container>
  
</template>

<script>
  import common from '../services/common.js'

  export default {
    name: 'Edit',
    components: {
      ConfirmationDialog: () => import('./ConfirmationDialog.vue')
    },
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
      getTrainings(){
        this.$api.getTrainings(this.selectedAgeGroupId)
          .then(resp => this.trainings = resp.data)
      },
      getAgeGroups(){
        this.$api.getAgeGroups()
          .then(resp => this.ageGroups = resp.data)
          .then(() => this.getTrainings())
      },
      postNewTrainings(){
        this.loading = true
        this.newTrainingsModel.ageGroupId = this.selectedAgeGroupId
        this.$api.postNewTrainings(this.newTrainingsModel)
          .then(() => {
            this.snackbar = { open: true, type: "success", text: "Trainingen zijn aangemaakt" }
            this.getTrainings()
          })
          .catch(() => this.snackbar = { open: true, type: "error", text: "Training kon niet aangemaakt worden" })
          .finally(() => this.loading = false)
      },
      showRegistries(expanded){
        if (expanded.value) {
          this.$api.getRegistries(expanded.item.id)
            .then(resp => this.registries = resp.data)
        }
      },
      async deleteTraining(training){
        if (await this.$refs.confirm.open("Bevestigen", "Ben je zeker dat je deze training wil verwijderen?")){
          this.$api.deleteTraining(training.id)
        .then(() => {
          this.snackbar = { open: true, type: "success", text: "Training is verwijderd" }
          this.getTrainings()
        })
        .catch(() => this.snackbar = { open: true, type: "error", text: "Training kon niet verwijderd worden" })
        }
      },
      async deleteRegistry(registry, training){
        if (await this.$refs.confirm.open("Bevestigen", "Ben je zeker dat je de registratie van <span class='text-uppercase font-weight-bold text-break'>" + registry.name + "</span> wil verwijderen?")){
          this.$api.deleteRegistry(registry.id)
          .then(() => {
            this.snackbar = { open: true, type: "success", text: "Registratie is verwijderd" }
            this.getTrainings()
            this.$api.getRegistries(training.id)
              .then(resp => this.registries = resp.data)
          })
          .catch(() => this.snackbar = { open: true, type: "error", text: "Registratie kon niet verwijderd worden" })
        }
      },
      customSort(items, index, isDesc) {
        return common.customSort(items, index, isDesc)
      }
    },

    data: () => ({
      snackbar: {
        open: true,
        type: "secondary",
        text: "Deze pagina is voor trainers! Ben je geen trainer, dan vind je alles op de homepagina"
      },
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
          text: "Verwijderen",
          value: "delete"
        }
      ],
      trainings: [],
      ageGroups: [],
      selectedAgeGroupIndex: 0,
      newTrainingsModel: {
        dates: [],
        startTime: null,
        endTime: null,
        maxRegistries: 10
      },
      
      startTimeMenu: null,
      endTimeMenu: null,
      loading: false,
      registries: [],
      rules: {
        required: value => !!value || "Verplicht veld"
      },
      valid: false
    }),
    mounted() {
      this.getAgeGroups()
    }
  }
</script>
