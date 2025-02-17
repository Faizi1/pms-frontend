<template>
  <div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="5">
          <div v-if="searchType">
            <b-form-group
              label="Token No"
              label-for="token_no"
              v-if="searchType.value === 1"
            >
              <b-form-input
                id="token_no"
                v-model="token_no"
                placeholder="Token No"
                @keydown="enterPressHandler"
                @input="inputHandler"
              />
            </b-form-group>
            <b-row v-if="searchType.value === 2">
              <b-col md="12">
                <b-form-group label="Status" label-for="status">
                  <v-select
                    id="status"
                    v-model="status"
                    :options="statusOptions"
                    placeholder="Status"
                    label="name"
                    @setMethod="(value) => (status = value)"
                    searchBy="name"
                    @input="inputHandlerValSelected"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 3">
              <b-col md="12">
                <b-form-group label="Start Date" label-for="startdate">
                  <b-form-datepicker
                    id="startdate"
                    v-model="start_date"
                  ></b-form-datepicker>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 4">
              <b-col md="12">
                <b-form-group label="Completion Date" label-for="comp_date">
                  <b-form-datepicker
                    id="comp_date"
                    v-model="completion_date"
                  ></b-form-datepicker>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row v-if="searchType.value === 5">
              <b-col>
                <b-form-group label="Army No" label-for="armyNo">
                  <b-form-input
                    id="armyNo"
                    v-model="president_armyNo"
                    placeholder="Army No"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <b-row v-if="searchType.value === 6">
              <b-col>
                <b-form-group label="Army No" label-for="armyNo1">
                  <b-form-input
                    id="armyNo1"
                    v-model="ordered_by_armyNo"
                    placeholder="Army No"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 7">
              <b-col>
                <b-form-group label="Nature of case" label-for="noc">
                  <b-form-input
                    id="noc"
                    v-model="noc"
                    placeholder="Nature of case"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 8">
              <b-col>
                <b-form-group label="Formation" label-for="formation">
                  <b-form-input
                    id="formation"
                    v-model="formation"
                    placeholder="Formation"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 9">
              <b-col>
                <b-form-group label="Brief" label-for="brief">
                  <b-form-input
                    id="brief"
                    v-model="brief"
                    placeholder="Brief"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="searchType.value === 10">
              <b-col>
                <b-form-group label="Army no" label-for="serviceNo">
                  <b-form-input
                    id="serviceNo"
                    v-model="serviceNo"
                    placeholder="Army No"
                    @keydown="enterPressHandler"
                    @input="inputHandler"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col md="4">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="searchTypes"
              placeholder="Search Type"
              label="name"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <b-form-group label="Sort With" label-for="sortType">
            <v-select
              id="sortType"
              v-model="sortType"
              :options="sortTypes"
              @input="search"
              placeholder="Sort With"
              label="name"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-table
        :fields="fields"
        :items="cases"
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
        <template #cell(start_date)="row">
          {{ getDateString(row.item.start_date) }}
        </template>
        <template #cell(completion_date)="row">
          {{ getDateString(row.item.completion_date) }}
        </template>
        <template #cell(brief)="row">
          <div :title="row.item.brief">
            {{ truncateText(row.item.brief, 30) }}
          </div>
        </template>
        <template #cell(status)="row">
          {{ statusNames(row.item.status) }}
        </template>
        <template #cell(ordered_by)="row">
          {{ getMembersData(row.item.ordered_by_data) }} - {{ getMember(row.item.ordered_by_data) }}
        </template>
        <template #cell(president)="row">
          {{ getMembersData(row.item.president_data) }} - {{ getMember(row.item.president_data) }}
        </template>
        <template #cell(history)="row">
          {{ getMarkedBy(row.item.history) }}
        </template>
        <template #cell(marked_on)="row">
          {{ getMarkedOn(row.item.history) }}
        </template>
        <template #cell(noc_data)="row">
          {{ row.item.noc_data ? row.item.noc_data.name : "" }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            @click="detailCase(row.item)"
            v-if="hasPermission('read_case')"
          >
            Detail
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeCase(row.item)"
            v-if="
              hasPermission('delete_case') &&
              (row.item.status == caseStatus.PENDING ||
                getLoggedInUser.role_data.code_name === 'su')
            "
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
    <case-detail-modal
      id="mark-case-detail-show-modal"
      :item="item"
      :allowEdit="allowEdit"
      @modalClosed="onModalClosed"
      @updateInPlaceData="updateInPlaceData"
      :key="`detail-${caseDetailModalCount}`"
    />
  </div>
</template>
  
<script>
import { mapActions, mapGetters } from "vuex";
import CaseDetailModal from "@/components/case/CaseDetailModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    CaseDetailModal,
    VueSelectPaginated,
  },
  mixins: [util],
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "token_no", label: "Token No" },
        { key: "brief", label: "brief" },
        { key: "no_of_officer", label: "no of indiv" },
        { key: "start_date", label: "start date" },
        { key: "completion_date", label: "completion date" },
        { key: "status", label: "status" },
        { key: "ordered_by", label: "ordered by" },
        { key: "president", label: "President" },
        { key: "noc_data", label: "Nature of Case" },
        { key: "history", label: "Marked By" },
        { key: "marked_on", label: "Marked On" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      caseDetailModalCount: 0,
      token_no: "",
      status: "",
      start_date: "",
      completion_date: "",
      president_prefix: null,
      president_armyNo: "",
      ordered_by_prefix: null,
      ordered_by_armyNo: "",
      remarks: "",
      recom: "",
      noc: "",
      brief: "",
      case_val: null,
      formation: "",
      serviceNo: "",
      searchType: { value: 1, name: "Token No" },
      sortType: { value: " ", name: "Sort With" },
      allowEdit: true,
    };
  },
  async mounted() {
    console.log('hi');
    
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getCases: "appData/getCases",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
      getParkingSpots: "appData/getParkingSpots",
    }),
    enterPressHandler(e) {
      if (e.code === "Enter" || e.code === "NumpadEnter") this.search();
    },
    inputHandler(val) {
      if (val === "" || !val) this.search();
    },
    inputHandlerValSelected(val) {
      if (val) this.search();
    },
    async search() {
      // if (this.searchType) {
      //   switch (this.searchType.value) {
      //     case 1:
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 2:
      //       this.token_no = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 3:
      //       this.token_no = "";
      //       this.status = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 4:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 5:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 6:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 7:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.formation = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 8:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.brief = "";
      //       this.serviceNo = "";
      //       break;
      //     case 9:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       this.serviceNo = "";
      //       break;
      //     case 10:
      //       this.token_no = "";
      //       this.status = "";
      //       this.start_date = "";
      //       this.completion_date = "";
      //       this.president_prefix = "";
      //       this.president_armyNo = "";
      //       this.ordered_by_prefix = "";
      //       this.ordered_by_armyNo = "";
      //       this.noc = "";
      //       this.formation = "";
      //       break;
      //   }
      // }
      // this.currentPage = 1;
      // await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getParkingSpots();

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
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>