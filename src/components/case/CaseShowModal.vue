<template>
  <div>
    <b-modal
      id="case-show-modal"
      title="Case show Modal"
      centered
      hide-footer
      size="xl"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
      dialog-class="my-dialog-class"
    >
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
          <template #cell(formation_data)="row">
            {{ row.item.formation_data.name }}
          </template>

          <template #cell(ordered_by)="row">
          {{ getMembersData(row.item.ordered_by_data) }} - {{ getMember(row.item.ordered_by_data) }}
        </template>
        <template #cell(president)="row">
          {{ getMembersData(row.item.president_data) }} - {{ getMember(row.item.president_data) }}
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
    </b-modal>
    <CaseDetailModal
      id="case-detail-show-modal"
      :item="item"
      @modalClosed="onModalClosed"
      :key="`detail-${caseShowDetailModalCount}`"
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
  props: {
    filter: Object,
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
        { key: "formation_data", label: "Formation" },
        { key: "ordered_by", label: "ordered by" },
        { key: "president", label: "President" },
        { key: "noc_data", label: "Nature of Case" },
        // { key: "findings", label: "findings" },
        // { key: "recom", label: "recom" },
        // { key: "verify by", label: "verify by" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      caseShowDetailModalCount: 0,
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
      brief: "",
      noc: "",
      formation: "",
      serviceNo: "",
      case_val: null,
      searchType: { value: 1, name: "Token No" },
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
      getCases: "appData/getCases",
      getPrefixes: "appData/getPrefixes",
      deleteCase: "appData/deleteCase",
    }),
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 2:
            this.token_no = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 3:
            this.token_no = "";
            this.status = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 4:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 5:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 6:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 7:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.formation = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 8:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.brief = "";
            this.serviceNo = "";
            break;
          case 9:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            this.serviceNo = "";
            break;
          case 10:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.noc = "";
            this.formation = "";
            break;
        }
      }
      this.currentPage = 1;
      await this.fetchSearchData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getCases({
          pageNumber: this.currentPage,
          draft: false,
          pageNumber: this.currentPage,
          draft: false,
          token_no: this.token_no,
          status: this.status ? this.status.value : "",
          start_date: this.start_date,
          completion_date: this.completion_date,
          president_prefix: this.president_prefix
            ? this.president_prefix.id
            : "",
          president_army_no: this.president_armyNo,
          ordered_by_army_prefix: this.ordered_by_prefix
            ? this.ordered_by_prefix.id
            : "",
          ordered_by_army_no: this.ordered_by_armyNo,
          remarks: this.remarks,
          recom: this.recom,
          brief: this.brief,
          noc_name: this.noc,
          formation_name: this.formation,
          ServiceNum: this.serviceNo,
          ...this.filter,
        });

        this.cases = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async fetchSearchData() {
      try {
        const res = await this.getCases({
          pageNumber: this.currentPage,
          draft: false,
          pageNumber: this.currentPage,
          draft: false,
          token_no: this.token_no,
          status: this.status ? this.status.value : "",
          start_date: this.start_date,
          completion_date: this.completion_date,
          president_prefix: this.president_prefix
            ? this.president_prefix.id
            : "",
          president_army_no: this.president_armyNo,
          ordered_by_army_prefix: this.ordered_by_prefix
            ? this.ordered_by_prefix.id
            : "",
          ordered_by_army_no: this.ordered_by_armyNo,
          remarks: this.remarks,
          recom: this.recom,
          brief: this.brief,
          noc_name: this.noc,
          formation_name: this.formation,
          ServiceNum: this.serviceNo,
        });

        this.cases = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async removeCase(item) {
      this.item = item;
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
            const res = await this.deleteCase({
              pk: this.item.id,
            });
            if (res.status === 204) {
              this.$swal({
                icon: "success",
                title: "Deleted!",
                text: "Case has been deleted.",
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
    detailCase(item) {
      this.item = item;
      this.caseShowDetailModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("case-detail-show-modal");
      });
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