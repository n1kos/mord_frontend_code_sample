<template>
  <nav class="pagination is-centered">
    <span v-if="total > 1">
      {{ "results" | t }} {{ from + 1 }} - {{ to }} {{ "of" | t }}
      {{ total }}
    </span>
    <span v-if="total == 1"> 1 {{ "result" | t }} </span>
    <ul class="pagination-list">
      <li>
        <button
          class="pagination-link has-pointer"
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
        >
          <span class="icon"><i class="fas fa-step-backward"></i></span>
          <span>{{ "first" | t }}</span>
        </button>
      </li>

      <li>
        <button
          class="pagination-link has-pointer"
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
        >
          <span class="icon"><i class="fas fa-caret-left fa-lg"></i></span>
          <span>{{ "prev" | t }}</span>
        </button>
      </li>

      <!-- this for will always start at 1, so we just need to change the display and the relevant parameter -->
      <li
        v-for="page in range(paginate.startPage, paginate.endPage)"
        :key="page"
      >
        <button
          class="pagination-link has-pointer"
          type="button"
          @click="onClickPage(page)"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page) }"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          class="pagination-link has-pointer"
          type="button"
          @click="onClickNextPage"
          :disabled="isInLastPage || noResultsPage"
        >
          <span>{{ "next" | t }}</span>
          <span class="icon"><i class="fas fa-caret-right fa-lg"></i></span>
        </button>
      </li>

      <li>
        <button
          class="pagination-link has-pointer"
          type="button"
          @click="onClickLastPage"
          :disabled="isInLastPage || noResultsPage"
        >
          <span>{{ "last" | t }}</span>
          <span class="icon"><i class="fas fa-step-forward"></i></span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
/* 
there is a bit of repetition, todo to clean up the code a little
*/
import Vue from "vue";
import Component from "vue-class-component";
import { langService as t } from "../shared/lang.service";

@Component({
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },

  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class Pagination extends Vue {
  constructor() {
    super();
  }

  // want this to be consistent across all pages, so we dont declare it as a property
  maxDisplayedPages = 10;

  get from() {
    return this.$props.currentPage * this.$props.perPage - this.$props.perPage;
  }

  get to() {
    return this.$props.currentPage * this.$props.perPage <= this.$props.total
      ? this.$props.currentPage * this.$props.perPage
      : this.$props.total;
  }

  get startPage() {
    // also in paginate
    if (this.$props.currentPage === 1) {
      return 1;
    }
    if (this.$props.currentPage === this.$props.totalPages) {
      return this.$props.totalPages - this.$props.maxVisibleButtons + 1;
    }
    return this.$props.currentPage - 1;
  }

  get endPage() {
    // also in paginate
    return Math.min(
      this.$props.startPage + this.$props.maxVisibleButtons - 1,
      this.$props.totalPages,
    );
  }

  get pages() {
    // also in paginate
    const range = [];
    for (let i = this.$props.startPage; i <= this.$props.endPage; i += 1) {
      range.push({
        name: i,
        isDisabled: i === this.$props.currentPage,
      });
    }
    return range;
  }

  get isInFirstPage() {
    return this.$props.currentPage === 1;
  }

  get isInLastPage() {
    return this.$props.currentPage === this.$props.totalPages;
  }

  get noResultsPage() {
    return this.$props.total == 0;
  }

  // https://jasonwatmore.com/post/2019/08/21/vue-js-simple-pagination-example
  get paginate() {
    const currentPage = this.$props.currentPage;
    const pageSize = this.$props.perPage;
    const maxPages = this.maxDisplayedPages;
    // calculate total pages
    const totalPages = this.$props.totalPages;
    var startPage, endPage;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      var maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      var maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    return {
      startPage: startPage,
      endPage: endPage,
    };
  }

  // v-for seems cannot start at a particular index, unless we use range.
  // could move to math.lib
  range(start: number, end: number) {
    return (
      Array(end - start + 1)
        //ts nags, but works
        // @ts-ignore
        .fill()
        .map((_: any, idx: number) => start + idx)
    );
  }
  onClickFirstPage() {
    this.$emit("pagechanged", 1);
  }

  onClickPreviousPage() {
    this.$emit("pagechanged", this.$props.currentPage - 1);
  }

  onClickPage(page: number) {
    this.$emit("pagechanged", page);
  }

  onClickNextPage() {
    this.$emit("pagechanged", this.$props.currentPage + 1);
  }

  onClickLastPage() {
    this.$emit("pagechanged", this.$props.totalPages);
  }

  isPageActive(page: number) {
    return this.$props.currentPage === page;
  }
}
</script>
