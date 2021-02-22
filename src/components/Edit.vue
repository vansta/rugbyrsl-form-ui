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
        >
          <template v-slot:item.delete="{ item }">
            <v-btn icon @click.stop="confirmDelete(item)">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length">
              <v-row v-for="registration in registries" :key="registration.id" dense>
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
    <!-- <v-card v-if="registries.length > 0">
      <v-card-title>
        Aanwezigheden
      </v-card-title>
      <v-card-text>
        <v-row v-for="trainingRegistry in registries" :key="trainingRegistry.id">
          <v-col cols="3">{{ trainingRegistry.name }}</v-col>
          <v-col cols="9">{{ trainingRegistry.remark }}</v-col>
        </v-row>
      </v-card-text>
    </v-card> -->
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

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          Ben je zeker dat je deze training wil verwijderen?
        </v-card-title>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn block color="secondary" @click="deleteTraining">Verwijderen</v-btn>
            </v-col>
            <v-col>
              <v-btn block color="primary" @click="dialog = false">Annuleren</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
  
</template>

<script>
  export default {
    name: 'Edit',
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
            this.snackbar = { open: true, type: "success", text: "Trainings have been added" }
            this.getTrainings()
          })
          .catch(() => this.snackbar = { open: true, type: "error", text: "Training could not be added" })
          .finally(() => this.loading = false)
      },
      showRegistries(expanded){
        if (expanded.value) {
          this.$api.getRegistries(expanded.item.id)
            .then(resp => this.registries = resp.data)
        }
      },
      confirmDelete(item){
        this.dialog = true
        this.editTraining = Object.assign({}, item)
      },
      deleteTraining(){
        this.dialog = false
        this.$api.deleteTraining(this.editTraining.id)
        .then(() => {
          this.snackbar = { open: true, type: "success", text: "Training has been removed" }
          this.getTrainings()
        })
        .catch(() => this.snackbar = { open: true, type: "error", text: "Training could not be removed" })
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
      dialog: false,
      editTraining: {},
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
