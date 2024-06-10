<template>
  <b-row class="h-100" no-gutters>
    <b-col cols="12" class="h-100">
      <div class="h-50 d-flex">
        <b-card
          no-body
          class="bg-warning text-white rounded h-100 m-0 font-weight-bolder text-center cursor-pointer w-50"
          @click="showCase({ officer: true })"
        >
          <p class="font-weight-bolder m-0 text-center w-100 mt-50">Officers</p>
          <b-card-body
            class="py-50 d-flex align-items-center justify-content-center"
          >
            <span
              class="m-0 text-white text-center font-weight-bolder my-font-size-lg"
            >
              {{ data.officer_count }}
            </span>
          </b-card-body>
        </b-card>
        <b-card
          no-body
          class="bg-secondary text-white rounded h-100 m-0 font-weight-bolder text-center cursor-pointer w-50 ml-50"
          @click="showCase({ jco: true })"
        >
          <p class="font-weight-bolder m-0 text-center w-100 mt-50">JCOs</p>
          <b-card-body
            class="py-50 d-flex align-items-center justify-content-center"
          >
            <span
              class="m-0 text-white text-center font-weight-bolder my-font-size-lg"
            >
              {{ data.jcos_count }}
            </span>
          </b-card-body>
        </b-card>
      </div>
      <div class="h-50 pt-50 d-flex">
        <b-card
          no-body
          class="bg-success text-white rounded h-100 m-0 font-weight-bolder text-center cursor-pointer w-100 mr-50"
          @click="showCase({ soldier: true })"
        >
          <p class="font-weight-bolder m-0 text-center w-100 mt-50">Soldier</p>
          <b-card-body
            class="py-50 d-flex align-items-center justify-content-center"
          >
            <span
              class="m-0 text-white text-center font-weight-bolder cursor-pointer my-font-size-lg"
            >
              {{ data.soldiers_count }}
            </span>
          </b-card-body>
        </b-card>
        <b-card
          no-body
          class="bg-info text-white rounded h-100 m-0 font-weight-bolder text-center cursor-pointer w-100"
          @click="showCase({ civilian: true })"
        >
          <p class="font-weight-bolder m-0 text-center w-100 mt-50">Civilian</p>
          <b-card-body
            class="py-50 d-flex align-items-center justify-content-center"
          >
            <span
              class="m-0 text-white text-center font-weight-bolder cursor-pointer my-font-size-lg"
            >
              {{ data.civilian_count }}
            </span>
          </b-card-body>
        </b-card>
      </div>
    </b-col>
  </b-row>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
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
      },
      filter: {},
    };
  },
  async created() {
    this.org_id = this.organization.org_id;
    try {
      const res = await this.getCivilianIndividualStatisticsData({
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
      // getStatisticsData: "appData/getStatisticsData",
      getCivilianIndividualStatisticsData:
        "appData/CivilianIndividualStatisticsData",
    }),
    showCase({ officer, jco, soldier, civilian }) {
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

        if (officer) {
          this.filter.status = null;
          this.filter.officer = true;
        }
        if (jco) {
          this.filter.status = null;
          this.filter.jco = true;
        }
        if (soldier) {
          this.filter.status = null;
          this.filter.soldier = true;
        }
        if (civilian) {
          this.filter.status = null;
          this.filter.civilian = true;
        }

        this.filter.draft = false;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.CAT_TABLE);
      } else {
        this.filter.empty_filter = true;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.CAT_TABLE);
      }
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      getLoggedInUser: "appData/getLoggedInUser",
    }),
  },
};
</script>
  
  <style></style>
  