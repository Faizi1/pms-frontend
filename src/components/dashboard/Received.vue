<!-- received.vue -->
<template>
  <b-row class="h-100" no-gutters>
    <b-col cols="6" class="h-100">
      <b-card
        no-body
        class="h-100 m-0 font-weight-bolder text-center mr-50 p-25"
      >
        <b-card-body class="h-100 p-0 pb-50">
          <div
            class="bright-bg-secondary text-white rounded h-50 d-flex align-items-center justify-content-center cursor-pointer my-font-size-lg"
            @click="showCase({ total_cases: true })"
          >
            Total: {{ data.total_cases }}
          </div>
          <div
            class="bright-bg-info text-white rounded h-50 d-flex align-items-center justify-content-center mt-50 cursor-pointer my-font-size-lg"
            @click="showCase({ in_process_cases: true })"
          >
            In Process: {{ data.in_process_cases }}
          </div>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col cols="6" class="h-100">
      <b-card no-body class="h-100 m-0 font-weight-bolder text-center p-25">
        <b-card-body class="h-100 p-0 pb-50">
          <div
            class="bright-bg-success text-white rounded h-50 d-flex align-items-center justify-content-center cursor-pointer my-font-size-lg"
            @click="showCase({ closed_cases: true })"
          >
            Completed: {{ data.closed_cases }}
          </div>
          <div
            class="bright-bg-danger text-white rounded h-50 d-flex align-items-center justify-content-center mt-50 cursor-pointer my-font-size-lg"
            @click="showCase({ overdue_cases: true })"
          >
            Overdue: {{ data.overdue_cases }}
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util.js";

export default {
  mixins: [util],
  props: {
    organization: Object,
    ps: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      data: {
        total_cases: 0,
        closed_cases: 0,
        overdue_cases: 0,
        in_process_cases: 0,
        org_id: null,
      },
      filter: {},
      dataLoaded: false, // Add dataLoaded flag
      // selectedOrganization: null,
    };
  },
  async created() {
    this.org_id = this.organization.org_id;
    try {
      const res = await this.getStatisticsData({
        organization_id: this.org_id,
        ps: this.ps,
      });
      this.data = res.data.data;
    } catch (error) {
      this.displayError(error);
    }
  },
  methods: {
    ...mapActions({
      getStatisticsData: "appData/getStatisticsData",
    }),

    showCase({ closed_cases, overdue_cases, in_process_cases, total_cases }) {
      this.filter = {};
      if (this.ps === 1) {
        this.filter.ps_1a = true;
      } else if (this.ps === 2) {
        this.filter.ps_1b = true;
      } else if (this.ps === 3) {
        this.filter.ps_1c = true;
      }
      if (this.org_id) {
        this.filter.status = [];
        this.filter.is_verified = true;
        this.filter.formation = this.org_id; // Add the organization_id to the filter object

        if (total_cases) {
          this.filter.status = null;
        }
        if (overdue_cases) {
          // this.filter.status = this.caseStatus.PROCESSING;
          this.filter.in_process_status = [
            this.caseStatus.PENDING,
            this.caseStatus.PROCESSING,
            this.caseStatus.FINALIZED,
          ];
          this.filter.overdue = true;
        }
        if (closed_cases) {
          this.filter.status = this.caseStatus.CLOSED;
        }
        if (in_process_cases) {
          this.filter.in_process_status = [
            this.caseStatus.PENDING,
            this.caseStatus.PROCESSING,
            this.caseStatus.FINALIZED,
          ];
        }
        this.filter.draft = false;

        this.$emit("caseShowModal", this.filter, this.showModalPlace.RECEIVED);
      } else {
        this.filter.empty_filter = true;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.RECEIVED);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
  // created() {
  //   // Listen for the emitted event and update selectedOrganization
  //   this.$root.$on("update-selected-organization", (organization) => {
  //     this.fetchDataForOrganization(organization);
  //   });
  // },
  // watch: {
  //   organization_id() {
  //     this.formationCases();
  //   },
  // },
};
</script>

<style>
.bright-bg-secondary {
  background-color: #585858;
}
.bright-bg-danger {
  background-color: #da2222;
}
.bright-bg-success {
  background-color: #2f972f;
}
.bright-bg-info {
  background-color: #268edd;
}
</style>
