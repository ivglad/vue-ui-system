<script setup>
import { FlexRender } from '@tanstack/vue-table'

const columnHelper = createColumnHelper()
const columns = ref([
  {
    id: 'select',
    header: ({ table }) => {
      return h(Checkbox, {
        modelValue: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
        binary: true,
        size: 'big',
      })
    },
    cell: ({ row }) => {
      return h(Checkbox, {
        modelValue: row.getIsSelected(),
        onChange: row.getToggleSelectedHandler(),
        disabled: !row.getCanSelect(),
        binary: true,
        size: 'big',
      })
    },
  },
  columnHelper.group({
    header: 'Пользователь',
    columns: [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: 'Имя',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: 'Фамилия',
        cell: (info) => info.getValue(),
      }),
    ],
  }),
  columnHelper.group({
    header: 'Информация',
    columns: [
      columnHelper.accessor('age', {
        header: 'Возраст',
      }),
      columnHelper.accessor('visits', {
        header: 'Посещений',
      }),
      columnHelper.accessor('status', {
        header: 'Статус',
      }),
      columnHelper.accessor('progress', {
        header: 'Прогресс',
      }),
    ],
  }),
])
const rows = ref(
  Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    name: `Имя ${i + 1}`,
    lastName: `Фамилия ${i + 1}`,
    age: Math.floor(Math.random() * 100),
    visits: Math.floor(Math.random() * 100),
    status:
      Math.floor(Math.random() * 100) % 2 === 0 ? 'Успешно' : 'Есть вопросы',
    progress: Math.floor(Math.random() * 100),
  })),
)
const rowSelection = ref({})
const sorting = ref([])
const table = useVueTable({
  get columns() {
    return columns.value
  },
  get data() {
    return rows.value
  },
  state: {
    get rowSelection() {
      return rowSelection.value
    },
    get sorting() {
      return sorting.value
    },
  },

  enableRowSelection: true,
  onRowSelectionChange: (updateOrValue) => {
    rowSelection.value =
      typeof updateOrValue === 'function'
        ? updateOrValue(rowSelection.value)
        : updateOrValue
  },
  isMultiSortEvent: () => true,
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue
  },
  getSortedRowModel: getSortedRowModel(),
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
const pageSizes = [10, 20, 50]
const pageHandler = (data) => {
  const pageSize = data.rows
  const page = data.page
  table.setPageSize(pageSize)
  table.setPageIndex(page)
}

const paginatorDropdownStyle = {
  pcRowPerPageDropdown: {
    root: {
      class: 'p-select-sm p-inputfield-sm ml-10',
    },
    overlay: {
      class: 'p-select-overlay-sm',
    },
  },
}
</script>

<template>
  <LayoutUiTemplate title="Tanstack table">
    <div class="content">
      <div class="flex flex-col gap-0">
        <div class="overflow-x-auto overflow-y-hidden">
          <table class="w-full pb-0 border-separate border-spacing-0">
            <thead class="text-[var(--surface-500)] bg-[var(--surface-100)]">
              <tr
                v-for="(headerGroup, hgIdx) in table.getHeaderGroups()"
                :key="headerGroup.id"
                class="h-12">
                <th
                  v-for="(header, hIdx) in headerGroup.headers"
                  :key="header.id"
                  :colSpan="header.colSpan"
                  :class="[
                    'py-4 pl-4 pr-8',
                    header.column.getCanSort() ? 'select-none' : '',
                    hgIdx === 1 ? 'text-left' : '',
                    hgIdx === 0 && hIdx === 0 ? 'rounded-tl-[10px]' : '',
                    hgIdx === 0 && hIdx === headerGroup.headers.length - 1 ? 'rounded-tr-[10px]' : '',
                  ]"
                  @click="header.column.getToggleSortingHandler()?.($event)">
                  <template v-if="!header.isPlaceholder">
                    <div class="relative flex items-center flex-nowrap w-fit mr-8">
                      <FlexRender
                        :render="header.column.columnDef.header"
                        :props="header.getContext()" />
                      <i-custom-triangle-down
                        v-show="
                          header.column.getCanSort() &&
                          header.column.getIsSorted() !== false
                        "
                        :style="
                          header.column.getIsSorted() === 'asc'
                            ? 'transform: rotate(180deg);'
                            : ''
                        "
                        class="absolute left-[calc(100%+0.5rem)] transition-none" />
                    </div>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rIdx) in table.getRowModel().rows"
                :key="row.id"
                :class="[
                  'transition-colors',
                  row.id == 2 ? 'opacity-40 select-none pointer-events-none grayscale' : '',
                  row.getIsSelected() ? 'bg-[var(--surface-100)]' : '',
                ]">
                <td
                  v-for="(cell, cIdx) in row.getVisibleCells()"
                  :key="cell.id"
                  :class="[
                    'py-2 pl-4 pr-8',
                    rIdx === table.getRowModel().rows.length - 1 && cIdx === 0 ? 'rounded-bl-[10px]' : '',
                    rIdx === table.getRowModel().rows.length - 1 && cIdx === row.getVisibleCells().length - 1 ? 'rounded-br-[10px]' : '',
                  ]">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()" />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr
                v-for="footerGroup in table.getFooterGroups()"
                :key="footerGroup.id">
                <th
                  v-for="header in footerGroup.headers"
                  :key="header.id"
                  :colSpan="header.colSpan">
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.footer"
                    :props="header.getContext()" />
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <Paginator
          @page="pageHandler"
          :rows="table.getState().pagination.pageSize"
          :totalRecords="rows.length"
          :rowsPerPageOptions="pageSizes"
          :pt="paginatorDropdownStyle" />
      </div>
    </div>
  </LayoutUiTemplate>
</template>

<style lang="scss" scoped>
</style>
