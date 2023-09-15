<script lang="ts">
  import { formatDate } from '$lib/utils/date'
  export let data
</script>

<svelte:head>
  <title>{data.post.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.post.title} />
</svelte:head>

<!-- <div>{JSON.stringify(data, null, 2)}</div> -->

<article>
  <hgroup>
    <h1 class="text-xl text-primary-600">{data.post.title}</h1>
    <p class="text-primary-900">{formatDate(data.post.date)}</p>
  </hgroup>

  <div class="">
    <ul class="flex flex-row gap-2">
      {#each data.post.categories as category}
        <li>
          <a href="/categories/{category}" class="text-sm text-secondary-800">#{category}</a>
        </li>
      {/each}
    </ul>
  </div>

  <div>
    <svelte:component this={data.post.content} />
  </div>
</article>
