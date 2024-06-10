<template>
    <div>
      <div class="text-right mb-1">
        <b-button
          variant="primary"
          pill
          @click="createOfficerData()"
          v-if="hasPermission('create_officer_data')"
        >
          <feather-icon icon="PlusIcon" class="mr-50" />
          <span class="align-middle">CREATE</span>
        </b-button>
      </div>
      <b-card>
        <b-row class="mb-1" align-v="center">
          <b-col cols="5">
            <b-form-group label="Service Number: (without prefix)" label-for="Svc_No">
              <b-form-input 
                id="Svc_No" 
                v-model="Svc_No" 
                placeholder="Example: 2124"
                type="number" 
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-button variant="primary" pill @click="search">
              <feather-icon icon="SearchIcon" class="mr-50" />
              <span class="align-middle">Search</span>
            </b-button>
          </b-col>
        </b-row>
        <b-table
          :fields="fields"
          :items="officersData"
          details-td-class="m-0 p-0"
          small
          v-if="hasPermission('read_case')"
          :per-page="0"
          responsive
          table-class="w-100"
        >
          <template #custom-foot>
            <b-tr variant="light">
              <b-td :colspan="fields.length">
                <span class="font-weight-bolder"
                  >Total Rows: {{ totalItems }}</span
                >
              </b-td>
            </b-tr>
          </template>
          <template #cell(rank_data)="row">
            {{ row.item.rank_data ? row.item.rank_data.name : "" }}
          </template>
          <template #cell(unit_data)="row">
            {{ row.item.unit_data ? row.item.unit_data.name : "" }}
          </template>
          <template #cell(formation_data)="row">
            {{ row.item.formation_data ? row.item.formation_data.name : "" }}
          </template>
          <template #cell(wards)="row">
            {{ wardsNames(row.item.wards) }}
          </template>
          <template #cell(created_by_data)="row">
            {{ row.item.created_by_data ? row.item.created_by_data.name : "" }}
          </template>
          <template #cell(present_address)="row">
            <div :title="row.item.present_address">
              {{ truncateText(row.item.present_address, 30) }}
            </div>
          </template>
  
          <template #cell(manage)="row">
            <b-button
              variant="success"
              pill
              class="mr-50"
              size="sm"
              @click="editOfficerData(row.item)"
            >
              Detail
            </b-button>
            <b-button
              variant="danger"
              pill
              size="sm"
              @click="deleteOfficerData(row.item)"
              v-if="hasPermission('delete_officer_data')"
            >
              Delete
            </b-button>
          </template>
        </b-table>
        <b-pagination
          size="md"
          :total-rows="totalItems"
          v-model="currentPage"
          :per-page="perPage"
          class="d-flex justify-content-center"
        ></b-pagination>
      </b-card>
      <CreateOfficersData
        @modalClosed="onModalClosed"
        :key="`create-${CreateOfficersDataModalCount}`"
      />
      <EditOfficersData
        :item="item"
        @modalClosed="onModalClosed"
        :key="`edit-${EditOfficersDataModalCount}`"
      />
    </div>
  </template>
    
  <script>
  import { mapActions, mapGetters } from "vuex";
  import CreateOfficersData from "@/components/officersData/CreateOfficersData.vue";
  import EditOfficersData from "@/components/officersData/EditOfficersData.vue";
  import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
  import util from "@/util.js";
  
  export default {
    components: {
      CreateOfficersData,
      EditOfficersData,
      VueSelectPaginated,
    },
    mixins: [util],
    data() {
      return {
        fields: [
          { key: "name", label: "Name" },
          { key: "svc_number", label: "Service Number" },
          { key: "email", label: "Email" },
          { key: "cnic", label: "CNIC" },
          { key: "mobile", label: "Mobile no" },
          { key: "pma_course", label: "PMA Course" },
          { key: "present_address", label: "Address" },
          { key: "wards", label: "Wards Of" },
          { key: "created_by_data", label: "Created by" },
          { key: "rank_data", label: "Rank" },
          { key: "unit_data", label: "Unit" },
          { key: "formation_data", label: "Formation" },
          { key: "form_filled_by", label: "Data Enter by" },
          { key: "manage", label: "Manage" },
        ],
        currentPage: 1,
        perPage: 0,
        totalItems: 0,
        officersData: [],
        item: null,
        CreateOfficersDataModalCount: 0,
        EditOfficersDataModalCount: 0,
        Svc_No: "",
        
      };
    },
    async mounted() {
      try {
        await this.fetchPaginatedData();
      } catch (error) {
        this.displayError(error);
      }
    },
    methods: {
      ...mapActions({
        getOfficersData: "appData/getOfficersData",
        deleteOfficersData: "appData/deleteOfficersData"
      }),
      async search() {
        this.currentPage = 1;
        await this.fetchPaginatedData();
      },
      async fetchPaginatedData() {
        try {
          const res = await this.getOfficersData({
            pageNumber: this.currentPage,
            svc_number: this.Svc_No,
          });
          this.officersData = res.data.results;
          this.totalItems = res.data.count;
          this.perPage = res.data.per_page;
        } catch (error) {
          this.displayError(error);
        }
      },
      createOfficerData() {
        this.CreateOfficersDataModalCount += 1;
        this.$nextTick(() => {
          this.$bvModal.show("officers-create-modal");
        });
      },

      editOfficerData(item) {
        this.item = item;
        this.EditOfficersDataModalCount += 1;
        this.$nextTick(() => {
          this.$bvModal.show("officers-edit-modal");
        });
      },
      async onModalClosed() {
        await this.fetchPaginatedData();
      },
      
      async deleteOfficerData(officersData) {
        try {
          this.$swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
          }).then(async (result) => {
            if (result.value) {
              const res = await this.deleteOfficersData({
                pk: officersData.id,
              });
              if (res.status === 204) {
                this.$swal({
                  icon: "success",
                  title: "Deleted!",
                  text: "Officer Data Delete has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
                if (
                  (this.totalItems - 1) % this.perPage === 0 &&
                  this.currentPage !== 1
                ) {
                  this.currentPage -= 1;
                } else {
                  await this.fetchPaginatedData();
                }
              }
            }
          });
        } catch (error) {
          this.displayError(error);
        }
      },
      enterPressHandler(e) {
      if (e.code === "Enter" || e.code === "NumpadEnter") this.search();
      },
      inputHandler(val) {
        if (val === "" || !val) this.search();
      },
      inputHandlerValSelected(val) {
        if (val) this.search();
      },
    },
    computed: {
      ...mapGetters({
        hasPermission: "appData/hasPermission",
        getLoggedInUser: "appData/getLoggedInUser",
      }),
      rows() {
        return this.petitions.length;
      },
    },
    watch: {
      currentPage: async function (val) {
        await this.fetchPaginatedData();
      },
    },
  };
  </script>
    
  <style></style>
    
    