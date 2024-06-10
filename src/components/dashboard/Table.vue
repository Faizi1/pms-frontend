<template>
  <b-card no-body class="h-100 m-0">
    <p class="font-weight-bolder m-0 text-center w-100 mt-50">
      Overall Cases By Formation
    </p>
    <b-card-body class="h-100 p-50">
      <b-table-simple
        hover
        bordered
        small
        caption-top
        sticky-header
        class="h-100"
      >
        <b-thead>
          <b-tr style="width: 100vh">
            <b-th style="width: 20%" class="text-center my-font-size p-25">
              ORGANIZATION
            </b-th>
            <b-th style="width: 20%" class="text-center my-font-size p-25">
              Completed
            </b-th>
            <b-th style="width: 20%" class="text-center my-font-size p-25">
              In Process
            </b-th>
            <b-th style="width: 20%" class="text-center my-font-size p-25">
              Over Due
            </b-th>
            <b-th style="width: 20%" class="text-center my-font-size p-25">
              Total
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="item in tableData"
            :key="item.org_id"
            style="width: 100vh"
          >
            <b-td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="selectOrganization(item)"
            >
              {{ item.org_name }}
            </b-td>
            <b-td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({ closed_cases: true, organization: item.org_id })
              "
            >
              {{ item.closed_cases }}
            </b-td>
            <b-td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  in_process_cases: true,
                  organization: item.org_id,
                })
              "
            >
              {{ item.in_process_cases }}
            </b-td>
            <b-td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  overdue_cases: true,
                  organization: item.org_id,
                })
              "
              :class="{ 'light-variant-danger': item.overdue_cases > 0 }"
            >
              {{ item.overdue_cases }}
            </b-td>
            <b-td
              style="width: 20%"
              class="text-center my-font-size-lg-table p-25"
              @click="
                showCase({
                  total_cases: true,
                  organization: item.org_id,
                })
              "
            >
              {{ item.total_cases }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapActions } from "vuex";
import CorpsTable from "@/components/dashboard/CorpsTable.vue";
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
  components: {
    CorpsTable,
  },

  data() {
    return {
      tableData: [],
      selectedOrganization: "", // Initialize to an empty string
      title: "",
      corpsTableCount: 0,
      fields: [
        { key: "org_name", label: "Organization" },
        { key: "closed_cases", label: "Completed" },
        { key: "in_process_cases", label: "In Process" },
        { key: "overdue_cases", label: "Over Due" },
        { key: "total_cases", label: "Total" },
      ],
      org_id: "",
    };
  },
  async created() {
    this.org_id = this.organization.org_id;
    this.populateTable();
  },

  methods: {
    ...mapActions({
      formationCases: "appData/formationCases",
    }),

    selectOrganization(organization) {
      this.selectedOrganization = organization;
      // this.title = organization;
      this.$emit("changeOrganization", organization); // Emit the event
    },
    async populateTable() {
      try {
        const res = await this.formationCases({
          organization_id: this.org_id,
          ps: this.ps,
        });
        this.tableData = res.data.data;
      } catch (error) {
        this.displayError(error);
      }
    },

    showCase({
      closed_cases,
      overdue_cases,
      in_process_cases,
      total_cases,
      organization,
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
 
        if (this.org_id === organization){
            this.filter.organization_self = this.org_id
        }
        else{
            this.filter.formation = organization; // Add the organization_id to the filter object
        }

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

        this.filter.draft = false;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.CAT_TABLE);
      } else {
        this.filter.empty_filter = true;
        this.$emit("caseShowModal", this.filter, this.showModalPlace.CAT_TABLE);
      }
    },
  },
};
</script>

<style scoped>
.my-font-size-lg {
  font-size: 1.5rem;
}
.my-font-size-sm {
  font-size: 1.5rem;
}
</style>
