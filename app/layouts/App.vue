<template>
    <div>
        <ApplicationUserToolbar />
            <slot />
        <footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 ">

            <span
class="text-center text-grey-darken-1 font-weight-thin text-subtitle-2 bottom-0 position-absolute"> {{ name }} v{{ version }}
            </span>
        </footer>
    </div>
</template>
<script setup>

import { firstCase, appPkg as pkg } from '../utils'
const version = pkg.version

const name = firstCase(pkg.name)
</script>