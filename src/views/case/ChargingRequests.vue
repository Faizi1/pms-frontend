<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="5">
              <b-form-input
                id="spot_id"
                v-model="spot_id"
                placeholder="Token No"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="createparkingSpot">
            <feather-icon icon="PlusIcon" class="mr-50" />
            <span class="align-middle">Create</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        :fields="fields"
        :items="cases"
        details-td-class="m-0 p-0"
        small
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
        <template #cell(manage)="row">
          <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="detailCase(row.item)"
          >
            Detail
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeCase(row.item)"
          >
            Delete
          </b-button>
        </template>
      </b-table>
    </b-card>
    <ParkingSpotCreateModal @modalClosed="onModalClosed"
    :showModal="visible" :key="`create-${parkingspotCreateModalCount}`" />
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import ParkingSpotCreateModal from "@/components/parkingspots/ParkingSpotCreateModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    VueSelectPaginated,
    ParkingSpotCreateModal
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "car_model", label: "Car Model" },
        { key: "battery_capacity", label: "Battery Capacity" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status" },
        { key: "request_time", label: "Request Time" },
        { key: "created_at", label: "Created At" },
        { key: "created_by", label: "Created By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      prefix: null,
      armyNo: "",
      isOldInquiry: false,
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
      getChargingrequests: "appData/getChargingrequests",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
    }),
    async search() {
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getChargingrequests();
        this.cases = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },

    async onModalClosed() {
      await this.fetchPaginatedData();
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
  
  