<template>
  <div>
    <b-row align-h="center" class="mb-1">
      <b-col class="d-flex align-items-center justify-content-between"> </b-col>
    </b-row>
    <b-row class="match-heights h-100">
      <h3 class="mb-0 text-center w-100">
        <span class="font-weight-bolder">Token No:</span>
        {{ caseObject ? caseObject.token_no : "" }}
      </h3>
      <b-col md="6">
        <label>History</label>
        <div class="h-100 border border-primary overflow-auto">
          <b-list-group-item
            v-for="(listItem, index) in markAndCalls"
            :key="index"
            tag="li"
          >
            <div class="d-flex">
              <div class="ml-25">
                <div v-if="listItem.type === 'Mark'">
                  <b-card-text class="mb-0 font-weight-bold">
                    From:
                    {{
                      `${listItem.marked_from_data.appointment_name} - ${listItem.marked_from_data.username}
                                          (${listItem.marked_from_data.organization})`
                    }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    To:
                    {{
                      `${listItem.marked_to_data.appointment_name} - ${listItem.marked_to_data.username}
                                          (${listItem.marked_to_data.organization})`
                    }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Time: {{ getDateString(listItem.marked_at) }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Type: {{ listItem.type }}
                    <feather-icon
                      icon="FileIcon"
                      size="20"
                      class="text-primary"
                    />
                  </b-card-text>
                  <b-card-text
                    class="mb-0 font-weight-bold"
                    v-if="
                      listItem.is_private &&
                      (listItem.marked_to === getLoggedInUser.id ||
                        listItem.marked_from === getLoggedInUser.id)
                    "
                  >
                    Comment:
                    <div v-html="listItem.comment" class="d-inline"></div>
                  </b-card-text>
                  <b-card-text
                    class="mb-0 font-weight-bold"
                    v-if="!listItem.is_private"
                  >
                    Comment:
                    <div v-html="listItem.comment" class="d-inline"></div>
                  </b-card-text>
                  <!-- <div
                    class="d-flex flex-wrap"
                    v-if="listItem.documents.length > 0"
                  >
                    <b-card-text class="mb-0 font-weight-bold">
                      Documents:
                    </b-card-text>
                    <b-badge
                      pill
                      variant="primary"
                      v-for="(file, index) in listItem.documents"
                      :key="`file-${index}`"
                      class="ml-50 cursor-pointer"
                      @click="openFile(file.path)"
                    >
                      {{ file.name }}
                    </b-badge>
                  </div> -->
                </div>
                <div v-if="listItem.type === 'Call'">
                  <b-card-text class="mb-0 font-weight-bold">
                    From:
                    {{
                      `${listItem.call_from_data.appointment_name} - ${listItem.call_from_data.name}
                                          (${listItem.call_from_data.organization})`
                    }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Time: {{ getDateString(listItem.call_at) }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Type: {{ listItem.type }}
                    <feather-icon
                      icon="PhoneCallIcon"
                      size="20"
                      class="text-primary"
                    />
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Comment: {{ listItem.comment }}
                  </b-card-text>
                </div>
                <div v-if="listItem.type === 'Disposed Call'">
                  <b-card-text class="mb-0 font-weight-bold">
                    From:
                    {{
                      `${listItem.call_from_data.appointment_name} - ${listItem.call_from_data.name}
                                          (${listItem.call_from_data.organization})`
                    }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Time: {{ getDateString(listItem.call_at) }}
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Type: {{ listItem.type }}
                    <feather-icon
                      icon="PhoneCallIcon"
                      size="20"
                      class="text-primary"
                    />
                  </b-card-text>
                  <b-card-text class="mb-0 font-weight-bold">
                    Comment: {{ listItem.comment }}
                  </b-card-text>
                </div>
              </div>
            </div>
          </b-list-group-item>
        </div>
      </b-col>
      <b-col md="6">
        <label>Currently Marked</label>
        <div class="h-100 border border-primary overflow-auto">
          <b-list-group-item
            v-for="(listItem, index) in caseObject.currently_marked_data"
            :key="index"
            tag="li"
          >
            <div class="d-flex">
              <div class="ml-25">
                <b-card-text class="mb-0 font-weight-bold">
                  {{ listItem.appointment_name }}-{{ listItem.username }} ({{
                    listItem.organization_data.name
                  }})
                </b-card-text>
              </div>
            </div>
          </b-list-group-item>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import util from "@/util.js";

export default {
  mixins: [util],
  props: {
    caseObject: Object,
    mode: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapGetters({ getLoggedInUser: "appData/getLoggedInUser" }),
    markAndCalls() {
      const arr = [];
      for (let i = 0; i < this.caseObject.history.length; i++) {
        const element = this.caseObject.history[i];
        arr.push({
          ...element,
          type: "Mark",
          time: element.marked_at,
        });
      }
      return arr.sort(function (a, b) {
        return new Date(b.time) - new Date(a.time);
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.vSelectStyle .vs__deselect {
  fill: #fff !important;
}

.scroll-area-size-history {
  height: 60vh;
}

.scroll-area-size ul {
  height: 100%;
}
</style>