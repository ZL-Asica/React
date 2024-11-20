import{_ as i,c as a,a2 as t,o as n}from"./chunks/framework.BQmytedh.js";const E=JSON.parse('{"title":"useWindowSize()","description":"","frontmatter":{},"headers":[],"relativePath":"docs/hooks/dom/useWindowSize.md","filePath":"docs/hooks/dom/useWindowSize.md"}'),h={name:"docs/hooks/dom/useWindowSize.md"};function e(l,s,k,p,d,r){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="usewindowsize" tabindex="-1">useWindowSize() <a class="header-anchor" href="#usewindowsize" aria-label="Permalink to &quot;useWindowSize()&quot;">​</a></h1><blockquote><p><strong>useWindowSize</strong>(): <code>object</code></p></blockquote><p>useWindowSize</p><p>A custom React hook to track the current window size. Automatically updates whenever the window is resized.</p><h2 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h2><p><code>object</code></p><p>An object containing the current window width and height.</p><h3 id="width" tabindex="-1">width <a class="header-anchor" href="#width" aria-label="Permalink to &quot;width&quot;">​</a></h3><blockquote><p><strong>width</strong>: <code>number</code></p></blockquote><h3 id="height" tabindex="-1">height <a class="header-anchor" href="#height" aria-label="Permalink to &quot;height&quot;">​</a></h3><blockquote><p><strong>height</strong>: <code>number</code></p></blockquote><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useWindowSize } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@zl-asica/react&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyComponent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useWindowSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">gt;</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Width</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lt;p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&amp;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">gt;</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">Height</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    &lt;/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in" aria-label="Permalink to &quot;Defined in&quot;">​</a></h2><p><a href="https://github.com/ZL-Asica/React/blob/0f57c3f52c2ae2a2fff74e581df989e16638bb64/src/hooks/dom/useWindowSize.ts#L29" target="_blank" rel="noreferrer">hooks/dom/useWindowSize.ts:29</a></p>`,15)]))}const g=i(h,[["render",e]]);export{E as __pageData,g as default};