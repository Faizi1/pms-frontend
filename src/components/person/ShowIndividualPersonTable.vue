<template>
  <div>
    <b-table :sticky-header="true" :fields="fields" :items="item"> </b-table>
    <span>{{ item }}</span>
  </div>
</template>
  
  <script>
export default {
  props: {
    members: Array,
  },
  data() {
    return {
      items: [],
      fields: [
        { key: "prefix_data.name", label: "Prefix" },
        { key: "army_no", label: "Army No" },
        { key: "rank_type_data.name", label: "rank" },
        { key: "unit", label: "unit" },
        { key: "name", label: "name" },
        { key: "cnic", label: "cnic" },
        { key: "member_type", label: "type" },
      ],
    };
  },
  mounted() {
    if (this.members) {
      this.members.forEach((ind) => {
        this.item.push(ind.individual_data);
      });
    }
  },
};
</script>
  
  <style></style>