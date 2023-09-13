<script>
  import '../app.postcss'
  import Header from '$lib/components/header.svelte'
  import Footer from '$lib/components/footer.svelte'
</script>

<div class="flex flex-col h-full mx-auto max-w-4xl py-6">
  <Header />

  <div class="flex flex-col flex-1 mt-6">
    <div class="flex-1">
      <slot />
    </div>

    <Footer />
  </div>
</div>
