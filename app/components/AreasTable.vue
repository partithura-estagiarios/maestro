<template>
  <div>
    <h3>{{ title }}</h3>
    <v-table>
        <thead>
            <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Repositório</th>
                <th class="text-right">ações</th>
            </tr>
        </thead>

        <VueDraggable
            v-model="internalAreas"
            :group="{
                name: 'areas',
                pull: true,
                put: true,
            }"
            item-key="value"
            tag="tbody"
            :animation="200"
            @add="emitChange"
            @remove="emitChange"
            @update="emitChange">
            <tr
                v-if="showPlaceholder && internalAreas.length === 0"
                class="drop-placeholder">
                <td
                    colspan="4"
                    class="text-center">
                    Arraste áreas para o projeto
                </td>
            </tr>
            <tr
                v-for="area in internalAreas"
                :key="area.value"
                :class="{
                  'clickable-row': clickableRows
                }"
                @click="handleRowClick(area)">
                <td>{{ area.text }}</td>
                <td>{{ area.value }}</td>
                <td>{{ area.repository }}</td>
                <td class="text-right">
                    <v-btn
                        :icon="actionIcon"
                        variant="text"
                        @click.stop="$emit('action-click', area)" />
                </td>
            </tr>
        </VueDraggable>
        <slot name="footer"/>
    </v-table>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  },
  actionIcon: {
    type: String,
    default: "mdi-delete"
  },
  clickableRows: {
    type: Boolean,
    default: false
  },
  showPlaceholder: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits([
  "update:modelValue",
  "row-click",
  "action-click",
  "drag-change"
])

const internalAreas = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v) 
});

function handleRowClick(area) {
  if (!props.clickableRows) return;
  emit("row-click", area);
}

function emitChange() {
  emit("drag-change");
}
</script>

<style scoped>

:deep(.v-table thead tr th) {
    background-color: #3a3a3a;
    font-size: 1rem;
}

.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.drop-placeholder {
    height: 64px;
    color: #777;
    font-style: italic;
}
</style>
