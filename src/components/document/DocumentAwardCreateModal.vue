<template>
  <b-modal
    id="document-award-create-modal"
    centered
    hide-footer
    size="lg"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
  >
    <template #modal-title>
      <h2 class="m-0">Document Upload</h2>
    </template>
    <validation-observer ref="documentAwardCreateFormValidation">
      <b-form @submit.prevent>
        <b-form-row>
          <b-col md="6">
            <VueSelectPaginated
              name="Award"
              label="name"
              :rules="{ required: true }"
              :getListMethod="getAwards"
              @setMethod="
                (value) => {
                  award = value;
                }
              "
            />
          </b-col>

          <b-col md="6">
            <b-form-group label-for="documents">
              <template #label>
                Documents <span class="text-danger"> *</span>
              </template>
              <b-form-file
                id="documents"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                multiple
                :accept="acceptedFiles.join(', ')"
                @change="upload"
                :file-name-formatter="formatFilesName"
              />
              <small
                class="text-dar"
                style="font-weight: bold; color: #067ae7cb"
                v-if="documentError === 0 && files.length == 0"
              >
                Please Upload PDF Only
              </small>
              <small class="text-danger" v-else-if="documentError === 3">
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
          </b-col>
        </b-form-row>

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
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import ShowLinkIndvForm from "@/components/document/DocumentAwardCreateModal.vue";
import util from "@/util.js";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    VueSelectPaginated,
  },
  props: {
    pk: Number,
    addItem: Boolean,
    case_no: Number,
  },
  mixins: [util],
  data() {
    return {
      required,
      files: [],
      documentError: 0,
      acceptedFiles: [".pdf"],
      award: null,
    };
  },
  mounted() {},
  methods: {
    ...mapActions({
      createDocumentAward: "appData/createDocumentAward",
      getAwards: "appData/getAwards",
    }),
    async validationForm() {
      const success =
        await this.$refs.documentAwardCreateFormValidation.validate();
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

      if (this.files.length == 0) {
        this.$swal({
          title: "Document is Required",
          icon: "error",
        });
        return;
      }
      const awardName = this.award.name;
      const fileName = this.files.map((file) => file.name).toString();
      const data = {
        created_by: this.getLoggedInUser.id,
        award: this.award.id,
        individual_involved: this.pk,
        add: this.addItem,
        case_no: this.case_no,
        detail: {
          awardName: awardName,
          fileName: fileName,
        },
      };
      const setData = {
        id: this.pk,
        awardName: awardName,
        fileName: fileName,
      };
      this.$emit("setIndividual", setData);
      formData.append("data", JSON.stringify(data));
      try {
        // const res = await this.createDocumentAward(formData);
        // if (res.status === 201) {
        //   this.$swal({
        //     title: "Documents Award created successfully",
        //     icon: "success",
        //   });
        this.$nextTick(() => {
          this.$bvModal.hide("document-award-create-modal");
        });
        this.$emit("uploadDocAndAward", formData);
        this.$swal({
          title:
            "Documents Award added successfully please click update button to save changes",
          icon: "success",
        });
        this.$emit("refreshDataWithAward");
        // }
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
  