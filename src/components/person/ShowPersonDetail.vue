<template>
    <div class="m-2 mb-1">

        <b-row class="m-1">
            <b-col class="text-center my-font-size-lg">Prefix</b-col>
            <b-col class="text-center my-font-size-lg">Army No </b-col>
            <b-col class="text-center my-font-size-lg">Rank </b-col>
            <b-col class="text-center my-font-size-lg">Name </b-col>
            <b-col class="text-center my-font-size-lg">Course</b-col>
            <b-col class="text-center my-font-size-lg">Unit</b-col>
        </b-row>
        <b-row>
            <b-col class="text-center">{{ member.prefix_data.name }}</b-col>
            <b-col class="text-center">{{ member.army_no }} </b-col>
            <b-col class="text-center">{{ member.rank_type_data.name }} </b-col>
            <b-col class="text-center">{{ member.name }} </b-col>
            <b-col class="text-center">{{ member.course }}</b-col>
            <b-col class="text-center">{{ member.unit_comd }}</b-col>
        </b-row>

    </div>
</template>

<script>
export default {
    props: {
        member: Object,
    },
    data() {
        return {
            fields: [
                { key: "prefix_data.name", label: "Prefix" },
                { key: "army_no", label: "Army No" },
                { key: "rank_type_data.name", label: "rank" },
                { key: "name", label: "name" },
                { key: "course", label: "course" },
                { key: "parent_unit", label: "unit" },
                // { key: "manage", label: "Manage" },
            ],
        }

    },
    mounted() {
        console.log(this.member);
    },
}
</script>

<style>
.my-font-size-lg {
    font-size: 1.2rem;
}
</style>