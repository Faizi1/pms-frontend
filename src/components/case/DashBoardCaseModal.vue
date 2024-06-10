<template>
  <div>
    <b-modal
      id="dashboard-case-modal"
      title="Cases"
      centered
      hide-footer
      size="xl"
      :no-close-on-esc="true"
      :no-close-on-backdrop="true"
      dialog-class="my-dialog-class"
    >
      <b-card>
        <b-row class="mb-1" align-v="center"> </b-row>
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
          <template #cell(status)="row">
            {{ statusNames(row.item.status) }}
          </template>
          <template #cell(brief)="row">
            <div :title="row.item.brief">
              {{ truncateText(row.item.brief, 30) }}
            </div>
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
              v-if="hasPermission('delete_case')"
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
    <CaseDashboardDetailModal
      id="dashboard-show-case-modal"
      :item="item"
      @modalClosed="onModalClosed"
      :key="`detail-dashboard-${DashboardcaseDetailModalCount}`"
    />
  </div>
</template>
      
    <script>
import { mapActions, mapGetters } from "vuex";
import CaseDashboardDetailModal from "@/components/case/CaseDetailModal.vue";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import util from "@/util.js";

export default {
  components: {
    CaseDashboardDetailModal,
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
        { key: "remarks", label: "remarks" },
        // { key: "findings", label: "findings" },
        // { key: "recom", label: "recom" },
        // { key: "verify by", label: "verify by" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      cases: [],
      item: null,
      DashboardcaseDetailModalCount: 0,
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
      case_val: null,
      searchType: { value: 1, name: "Token No" },
    };
  },
  async mounted() {
    if (this.filter.token_no || this.filter.army_no) {
      const res = await this.getCases({
        pageNumber: this.currentPage,
        draft: false,
        token_no: this.filter.token_no,
        ServiceNum: this.filter.army_no,
      });

      this.cases = res.data.results;
      this.totalItems = res.data.count;
      this.perPage = res.data.per_page;
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
            this.remarks = "";
            this.recom = "";
            this.brief = "";
            break;
          case 2:
            this.token_no = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.remarks = "";
            this.recom = "";
            this.brief = "";
            break;
          case 3:
            this.token_no = "";
            this.status = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.remarks = "";
            this.recom = "";
            this.brief = "";
            break;
          case 4:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.remarks = "";
            this.recom = "";
            this.brief = "";
            break;
          case 5:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.ordered_by_prefix = "";
            this.ordered_by_armyNo = "";
            this.remarks = "";
            this.recom = "";
            this.brief = "";
            break;
          case 6:
            this.token_no = "";
            this.status = "";
            this.start_date = "";
            this.completion_date = "";
            this.president_prefix = "";
            this.president_armyNo = "";
            this.remarks = "";
            this.recom = "";
            this.brief = "";
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
            this.recom = "";
            this.brief = "";
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
            this.remarks = "";
            this.brief = "";
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
            this.remarks = "";
            break;
        }
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getCases({
          pageNumber: this.currentPage,
          draft: false,
          token_no: this.filter,
        });

        this.cases = res.data.results;
        console.log(this.cases);
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    async removeCase(item) {
      this.item = item;
      try {
        const res = await this.deleteCase({
          pk: this.item.id,
        });
        if (res.status === 204) {
          this.$swal({
            title: "Case deleted successfully",
            icon: "success",
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
      } catch (error) {
        this.displayError(error);
      }
    },
    detailCase(item) {
      this.item = item;
      this.DashboardcaseDetailModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("dashboard-show-case-modal");
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