<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        class="mr-50"
        variant="success"
        pill
        @click="addAppointment"
        v-if="hasPermission('create_appointment')"
        v-b-tooltip.hover="'Get appointments from Users API'"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Sync</span>
      </b-button>

      <b-button
        variant="primary"
        pill
        @click="createAppointment"
        v-if="hasPermission('create_appointment')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="appointments"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_appointment')"
        :per-page="0"
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
        <template #cell(created_at)="row">
          {{ getDateString(row.item.created_at) }}
        </template>
        <template #cell(updated_at)="row">
          {{ getDateString(row.item.updated_at) }}
        </template>
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data
              ? `${row.item.created_by_data.appointment_name} -
                      ${row.item.created_by_data.name}`
              : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data
              ? `${row.item.updated_by_data.appointment_name} -
                      ${row.item.updated_by_data.name}`
              : ""
          }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-1"
            @click="editAppointment(row.item)"
            v-if="hasPermission('update_appointment')"
          >
            Edit
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            @click="removeAppointment(row.item)"
            v-if="hasPermission('delete_appointment')"
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
      ></b-pagination>
      <!-- <span class="mt-1 bg1 float-right" >Total Rows: {{ rows }}</span> -->
    </b-card>
    <appointment-create-modal
      @modalClosed="onModalClosed"
      :key="`create-${appointmentCreateModalCount}`"
    />
    <appointment-edit-modal
      :appointment="appointment"
      @modalClosed="onModalClosed"
      :key="`edit-${appointmentEditModalCount}`"
    />
    <b-overlay :show="show" variant="white" spinner-variant="primary" no-wrap />
  </div>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import AppointmentCreateModal from "@/components/appointment/AppointmentCreateModal.vue";
import AppointmentEditModal from "@/components/appointment/AppointmentEditModal.vue";
import util from "@/util.js";

export default {
  components: {
    AppointmentCreateModal,
    AppointmentEditModal,
  },
  data() {
    return {
      fields: [
        { key: "manage", label: "Manage" },
        { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "created_at", label: "Created At" },
        { key: "created_by_data", label: "Created By" },
        { key: "updated_at", label: "Created At" },
        { key: "updated_by_data", label: "Updated By" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      appointments: [],
      appointment: null,
      appointmentCreateModalCount: 0,
      appointmentEditModalCount: 0,
      show: false,
    };
  },
  mixins: [util],
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getAppointments: "appData/getAppointments",
      deleteAppointment: "appData/deleteAppointment",
      addAppointmentFromUserAPI: "appData/addAppointmentFromUserAPI",
    }),
    async fetchPaginatedData() {
      try {
        const res = await this.getAppointments({
          pageNumber: this.currentPage,
        });
        this.appointments = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createAppointment() {
      this.appointmentCreateModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("appointment-create-modal");
      });
    },
    editAppointment(appointment) {
      this.appointment = appointment;
      this.appointmentEditModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("appointment-edit-modal");
      });
    },
    async removeAppointment(appointment) {
      this.appointment = appointment;
      try {
        this.$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.value) {
          const res = await this.deleteAppointment({
          pk: this.appointment.id,
          });
          if (res.status === 204) {
            this.$swal({
              title: "Appointment deleted successfully",
              icon: "success",
              text: "Appointment has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
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
      }
    });
    } catch (error) {
      this.displayError(error);
    }
    },

    async addAppointment() {
      this.show = true;
      try {
        const res = await this.addAppointmentFromUserAPI();
        if (res.status === 200) {
          this.$swal({
            title: "Appointments Added From User API successfully",
            icon: "success",
          });
          this.show = false;
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
        this.show = false;
        this.displayError(error);
      }
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
    }),
    rows() {
      return this.appointments.length;
    },
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>
  
  <style>
.bg1 {
  color: red;
  font-weight: normal;
}
</style>
  
  