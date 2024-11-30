import{_ as i,c as s,a2 as e,o as t}from"./chunks/framework.BQmytedh.js";const c=JSON.parse('{"title":"clamp()","description":"","frontmatter":{},"headers":[],"relativePath":"docs/utils/clamp.md","filePath":"docs/utils/clamp.md"}'),l={name:"docs/utils/clamp.md"};function n(h,a,p,r,d,o){return t(),s("div",null,a[0]||(a[0]=[e(`<h1 id="clamp" tabindex="-1">clamp() <a class="header-anchor" href="#clamp" aria-label="Permalink to &quot;clamp()&quot;">​</a></h1><blockquote><p><strong>clamp</strong>(<code>value</code>, <code>min</code>, <code>max</code>): <code>number</code></p></blockquote><p>Clamps a number to a specified range.</p><h2 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters" aria-label="Permalink to &quot;Parameters&quot;">​</a></h2><h3 id="value" tabindex="-1">value <a class="header-anchor" href="#value" aria-label="Permalink to &quot;value&quot;">​</a></h3><p><code>number</code></p><p>The number to clamp.</p><h3 id="min" tabindex="-1">min <a class="header-anchor" href="#min" aria-label="Permalink to &quot;min&quot;">​</a></h3><p><code>number</code></p><p>The minimum value.</p><h3 id="max" tabindex="-1">max <a class="header-anchor" href="#max" aria-label="Permalink to &quot;max&quot;">​</a></h3><p><code>number</code></p><p>The maximum value.</p><h2 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h2><p><code>number</code></p><p>The clamped value. Returns <code>NaN</code> if inputs are invalid.</p><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> clamped</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clamp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 10</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> clamped</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clamp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 0</span></span></code></pre></div><h2 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in" aria-label="Permalink to &quot;Defined in&quot;">​</a></h2><p><a href="https://github.com/ZL-Asica/React/blob/431add57a8cd5ffa86565b451f7d8d71f191a426/src/utils/mathUtils.ts#L51" target="_blank" rel="noreferrer">src/utils/mathUtils.ts:51</a></p>`,20)]))}const m=i(l,[["render",n]]);export{c as __pageData,m as default};
