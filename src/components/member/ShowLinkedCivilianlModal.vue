<template>
  <b-modal
    id="show_linked-indv-create-modal"
    title="Prefix Create Modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Civilian Individual</h2>
    </template>
    <b-card>
      <b-table
        :fields="fields"
        :items="members"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_member')"
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

        <template #cell(manage)="row">
          <b-button
            variant="success"
            pill
            class="mr-50"
            size="sm"
            v-if="!(mode === modes.VIEW)"
            @click="removeCivilian(row.item)"
          >
            Remove
          </b-button>
        </template>
      </b-table>
    </b-card>
  </b-modal>
</template>
    
    <script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateAwardModal from "@/components/award/CreateAwardModal.vue";
import DocumentCreateModal from "@/components/document/DocumentCreateModal.vue";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
    DocumentCreateModal,
    CreateAwardModal,
  },
  props: {
    data: [],
    case_id: Number,
    mode: {
      type: Number,
      default: 0,
    },
  },
  mixins: [util],
  data() {
    return {
      required,
      name: "",
      cnic: "",
      members: [],
      totalItems: 0,
      item: null,
      fields: [
        { key: "name", label: "name" },
        { key: "cnic", label: "cnic" },
        { key: "manage", label: "Manage" },
      ],
    };
  },
  mounted() {
    this.members = this.data;
    this.totalItems = this.data.length;
  },
  methods: {
    ...mapActions({
      deleteCivilian: "appData/removeCivilian",
    }),
    refreshDataWithAward() {
      this.$emit("refreshDataWithAward");
    },

    async removeCivilian(item) {
      if (this.mode === this.modes.CREATE) {
        this.$emit("removeCivilian", item);
        this.$nextTick(() => {
          this.$bvModal.hide("show_linked-indv-create-modal");
        });
        this.refreshDataWithAward();
        this.$emit("modalClosed");
      } else if (this.mode === this.modes.EDIT) {
        if (item) {
          if (this.case_id) {
            item["case_id"] = this.case_id;
          }
        }
        this.$emit("removeCivilian", item);
        this.$nextTick(() => {
          this.$bvModal.hide("show_linked-indv-create-modal");
        });
        this.refreshDataWithAward();
        this.$emit("modalClosed");
      } else {
        try {
          // const data = {
          //   case_id: this.case_id,
          //   civilian_id: this.item[0].id,
          // };
          // const res = await this.deleteCivilian(data);
          // if (res.status === 200) {
          //   this.$swal({
          //     title: "civilian remove successfully",
          //     icon: "success",
          //   });
          //   this.$nextTick(() => {
          //     this.$bvModal.hide("show_linked-indv-create-modal");
          //   });
          //   this.refreshDataWithAward();
          //   this.$emit("modalClosed");
          // }
        } catch (error) {
          this.displayError(error);
        }
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
    