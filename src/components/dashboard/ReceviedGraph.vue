<template>
  <!-- <div class="h-100">
    <apexchart
      v-if="chartSeries.length > 0"
      type="pie"
      :options="chartOptions"
      :series="chartSeries"
    ></apexchart>
  </div> -->
  <b-card no-body class="h-100 m-0">
    <p class="font-weight-bolder m-0 text-center w-100 mt-50">Status Wise</p>
    <b-card-body class="h-100 p-50">
      <apexchart
        v-if="chartSeries.length > 0"
        type="pie"
        :options="chartOptions"
        :series="chartSeries"
      ></apexchart>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapActions } from "vuex";
import util from "@/util.js";
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },

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
      data: {},
      chartOptions: {
        labels: ["Completed", "Overdue", "In Process"],
        legend: {
          position: "bottom",
        },
        colors: ["#008000", "#ff0000", "#3692eb"],
        chart: {
          width: 500, // Increase the width to make it larger
          height: 500, // Increase the height to make it larger
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleChartClick(config.dataPointIndex);
            },
          },
        },
      },
      chartSeries: [],
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
      this.updateChartSeries();
    } catch (error) {
      this.displayError(error);
    }
  },

  methods: {
    ...mapActions({
      getStatisticsData: "appData/getStatisticsData",
    }),

    updateChartSeries() {
      this.chartSeries = [
        this.data.closed_cases,
        this.data.overdue_cases,
        this.data.in_process_cases,
      ];
    },

    handleChartClick(dataPointIndex) {
      // Handle the chart click event

      const clickedIndex = dataPointIndex;
      console.log("clickedIndex", clickedIndex);
      switch (clickedIndex) {
        case 0:
          this.showCase({ closed_cases: true });
          break;
        case 1:
          this.showCase({ overdue_cases: true });
          break;
        case 2:
          this.showCase({ in_process_cases: true });
          break;
        default:
          break;
      }
    },

    showCase({
      closed_cases,
      overdue_cases,
      in_process_cases,
      total_cases,
      pending_cases,
    }) {
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
        this.filter.formation = this.org_id;

        if (total_cases) {
          this.filter.status = null;
        }
        if (overdue_cases) {
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
        if (pending_cases) {
          this.filter.status = this.caseStatus.PENDING;
          this.filter.is_verified = false;
        }

        this.filter.draft = false;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.RECEIVED);
      } else {
        this.filter.empty_filter = true;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.RECEIVED);
      }
    },
  },
};
</script>

<style scoped>
.height-content {
  height: min-content;
  /* Add any necessary styles for the chart container */
}
</style>
