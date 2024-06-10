<template>
  <b-card no-body class="h-100 m-0">
    <p class="font-weight-bolder m-0 text-center w-100 mt-50">CAT Wise</p>
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
        labels: ["Officers", "JCOs", "Soldier", "Civilian"],
        legend: {
          position: "bottom",
        },
        colors: ["#ffce56", "#6c757d", "#FD1C03", "#3692eb"],
        chart: {
          width: 300, // Specify the width in pixels
          height: 300, // Specify the height in pixels
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
      const res = await this.getCivilianIndividualStatisticsData({
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
      getCivilianIndividualStatisticsData:
        "appData/CivilianIndividualStatisticsData",
    }),
    updateChartSeries() {
      this.chartSeries = [
        this.data.officer_count,
        this.data.jcos_count,
        this.data.soldiers_count,
        this.data.civilian_count,
      ];
    },
    handleChartClick(dataPointIndex) {
      // Handle the chart click event
      const clickedIndex = dataPointIndex;
      switch (clickedIndex) {
        case 0:
          this.showCase({ officer: true });
          break;
        case 1:
          this.showCase({ jco: true });
          break;
        case 2:
          this.showCase({ soldier: true });
          break;
        case 3:
          this.showCase({ civilian: true });
          break;
        default:
          break;
      }
    },
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
/* Add any necessary styles for the chart container */
</style>
