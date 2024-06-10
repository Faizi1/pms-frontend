<template>
  <b-modal
    :id="id"
    title="Document Upload Modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Document Upload</h2>
    </template>
    <validation-observer ref="documentCreateFormValidation">
      <b-form @submit.prevent>
        <b-form-group label-for="documents">
          <template #label> Documents </template>
          <b-form-file
            id="documents"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            multiple
            :accept="acceptedFiles.join(', ')"
            @change="upload"
            :file-name-formatter="formatFilesName"
          />
          <small class="text-danger" v-if="documentError === 3">
            Supported File Types are {{ acceptedFiles.join(", ") }}
          </small>
          <div class="d-flex flex-wrap">
            <b-badge
              pill
              variant="primary"
              v-for="(file, index) in files"
              :key="index"
              class="mr-50 mt-50"
            >
              {{ file.name }}
              <feather-icon
                size="24"
                icon="XIcon"
                class="cursor-pointer"
                @click="removeFile(index)"
              />
            </b-badge>
          </div>
        </b-form-group>
        <b-form-group class="mt-2 text-right">
          <b-button
            type="submit"
            variant="primary"
            pill
            class="mr-1"
            @click="validationForm"
          >
            Upload
          </b-button>
        </b-form-group>
      </b-form>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    id: String,
    isPetitionDocument: Boolean,
  },
  mixins: [util],
  data() {
    return {
      required,
      files: [],
      documentError: 0,
      acceptedFiles: [".jpg", ".jpeg", ".png", ".pdf", ".docx"],
    };
  },
  methods: {
    ...mapActions({
      createDocument: "appData/createDocument",
    }),
    async validationForm() {
      const success = await this.$refs.documentCreateFormValidation.validate();
      if (success) {
        await this.submit();
      }
    },
    async submit() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files[" + i + "]", file);
      }

      const data = {
        created_by: this.getLoggedInUser.id,
      };

      formData.append("data", JSON.stringify(data));

      try {
        const res = await this.createDocument(formData);
        if (res.status === 201) {
          this.$swal({
            title: "Documents created successfully",
            icon: "success",
          });
          this.$nextTick(() => {
            this.$bvModal.hide(this.id);
          });
          this.$emit("modalClosed", res.data);
        }
      } catch (error) {
        this.displayError(error);
      }
    },
    async upload(event) {
      this.documentError = 0;

      const files = event.target.files;
      if (files.length > this.maxFilesCount) {
        this.documentError = 1;
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.slice(
          ((file.name.lastIndexOf(".") - 1) >>> 0) + 1
        );
        if (file.size > this.maxFileSize * 100 * 1024) {
          this.documentError = 2;
          return;
        }
        if (!this.acceptedFiles.includes(ext)) {
          this.documentError = 3;
          return;
        }
      }

      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    },
    formatFilesName(files) {
      return this.files.length === 1
        ? this.files[0].name
        : `${this.files.length} files selected`;
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
  },
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
  },
};
</script>

<style></style>
