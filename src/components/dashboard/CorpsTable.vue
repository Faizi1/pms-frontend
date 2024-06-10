<template>
  <b-modal
    id="corps-table-modal"
    centered
    size="xl"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    dialog-class="my-dialog-class"
  >
    <template #modal-title>
      <h2 class="m-0">{{ title }}</h2>
    </template>
    <div class="h-100">
      <div style="height: 100%" class="overflow-auto">
        <b-table-simple hover bordered caption-top responsive="sm" class="mb-0">
          <b-thead>
            <b-tr>
              <b-th class="text-center my-font-size-lg">Organizations</b-th>
              <b-th class="text-center my-font-size-lg">Total</b-th>
              <b-th class="text-center my-font-size-lg">Completed</b-th>
              <b-th class="text-center my-font-size-lg">In Process</b-th>
              <b-th class="text-center my-font-size-lg">Overdue</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(item, index) in tableData" :key="index">
              <b-td class="text-center my-font-size-sm">{{ index + 1 }}</b-td>
              <b-td class="text-center my-font-size-sm">{{
                item.natureOfCase
              }}</b-td>
              <b-td class="text-center my-font-size-sm">{{
                item.completed
              }}</b-td>
              <b-td class="text-center my-font-size-sm">{{
                item.inProcess
              }}</b-td>
              <b-td class="text-center my-font-size-sm">{{
                item.overdue
              }}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </div>
    </div>
    <template #modal-footer>
      <h1></h1>
    </template>
  </b-modal>
</template>
  
  <script>
export default {
  props: {
    title: String,
  },
  mounted() {},
  data() {
    return {
      tableData: [],
      nocs: [
        {
          name: "Comd Failure",
        },
        {
          name: "Fin Irregularites",
        },
        {
          name: "Civ Offence",
        },
        {
          name: "Miuse of Manpower",
        },
        {
          name: "Cheating in Exam",
        },
        {
          name: "Loss of Govt Property",
        },
        {
          name: "Intoxication",
        },
        // {
        //   name: "Murder",
        // },
        // {
        //   name: "Involvement in Undesirable Activities",
        // },
        // {
        //   name: "Matrimonial Issue",
        // },
        // {
        //   name: "Fin Emb/Misappropriation",
        // },
        // {
        //   name: "Loss of Paid Card",
        // },
        // {
        //   name: "AWOL/Desertion/OSL",
        // },
        // {
        //   name: "Drug Indulgence",
        // },
        // {
        //   name: "Conduct Unbecoming",
        // },
        {
          name: "Cheating",
        },
        {
          name: "Cyber Violations",
        },
      ],
    };
  },
  methods: {
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    populateTable() {
      for (let i = 0; i < this.nocs.length; i++) {
        const natureOfCase = this.nocs[i].name;
        const completed = 0;
        const inProcess = 0;
        const overdue = 0;

        this.tableData.push({
          natureOfCase,
          completed,
          inProcess,
          overdue,
        });
      }
    },
  },
  created() {
    this.populateTable();
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
  