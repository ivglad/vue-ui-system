<script setup></script>

<template>
  <LayoutUiTemplate title="Progress">
    <div class="content">
      <div class="flex flex-col gap-2">
        <ProgressBar
          mode="indeterminate"
          class="app-progressline"></ProgressBar>
        <ProgressBar :value="50" class="app-progressline-percent"></ProgressBar>
        <ProgressSpinner class="app-progressspinner" fill="transparent" />
      </div>
    </div>
  </LayoutUiTemplate>
</template>
