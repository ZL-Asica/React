import{_ as i,c as a,a2 as e,o as t}from"./chunks/framework.BQmytedh.js";const c=JSON.parse('{"title":"generateUniqueId()","description":"","frontmatter":{},"headers":[],"relativePath":"docs/utils/generateUniqueId.md","filePath":"docs/utils/generateUniqueId.md"}'),n={name:"docs/utils/generateUniqueId.md"};function h(l,s,r,p,o,d){return t(),a("div",null,s[0]||(s[0]=[e(`<h1 id="generateuniqueid" tabindex="-1">generateUniqueId() <a class="header-anchor" href="#generateuniqueid" aria-label="Permalink to &quot;generateUniqueId()&quot;">​</a></h1><blockquote><p><strong>generateUniqueId</strong>(<code>inputValues</code>, <code>randomBias</code>?, <code>length</code>?): <code>Promise</code>&lt;<code>string</code>&gt;</p></blockquote><p>Generates a unique identifier by hashing an array of input strings, a timestamp, and a random value.</p><p>This function combines the provided input strings (<code>inputValues</code>), the current timestamp, and an optional random bias (<code>randomBias</code>). It applies the SHA-256 hashing algorithm (if supported), and returns a hexadecimal string truncated to the specified length.</p><p>If <code>crypto.subtle.digest</code> is not supported in the current environment, the function falls back to generating a random string using <code>Math.random()</code> and the current timestamp. Note that the fallback mechanism is less secure and should not be used for cryptographic purposes.</p><p>The default length is 6 characters, which is sufficient for millions of records per millisecond thanks to the inclusion of a highly random <code>randomBias</code>. For shorter lengths, it is recommended not to go below 4 characters to minimize the risk of collisions.</p><h2 id="parameters" tabindex="-1">Parameters <a class="header-anchor" href="#parameters" aria-label="Permalink to &quot;Parameters&quot;">​</a></h2><p>• <strong>inputValues</strong>: <code>string</code>[]</p><p>An array of input strings (e.g., user ID, file name, or other identifiers). These will be concatenated to form part of the unique ID input.</p><p>• <strong>randomBias?</strong>: <code>string</code> = <code>...</code></p><p>An optional random bias string. By default, it combines two random Base-36 strings, providing approximately (2^{104}) possible combinations, significantly reducing collision risk.</p><p>• <strong>length?</strong>: <code>number</code> = <code>6</code></p><p>The desired length of the resulting unique ID. Must be at least 1. Defaults to 6 characters.</p><h2 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h2><p><code>Promise</code>&lt;<code>string</code>&gt;</p><p>A promise resolving to the generated unique ID as a hexadecimal string. If the environment lacks support for <code>crypto.subtle.digest</code>, a non-hashed random string is returned.</p><h2 id="async" tabindex="-1">Async <a class="header-anchor" href="#async" aria-label="Permalink to &quot;Async&quot;">​</a></h2><h2 id="throws" tabindex="-1">Throws <a class="header-anchor" href="#throws" aria-label="Permalink to &quot;Throws&quot;">​</a></h2><p>Throws if the <code>length</code> parameter is less than 1.</p><h2 id="throws-1" tabindex="-1">Throws <a class="header-anchor" href="#throws-1" aria-label="Permalink to &quot;Throws&quot;">​</a></h2><p>Throws if any element in <code>inputValues</code> or <code>randomBias</code> is not a string, or if <code>length</code> is not a number.</p><h2 id="throws-2" tabindex="-1">Throws <a class="header-anchor" href="#throws-2" aria-label="Permalink to &quot;Throws&quot;">​</a></h2><p>Throws if <code>crypto.subtle.digest</code> is not supported and no fallback mechanism is possible.</p><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to &quot;Examples&quot;">​</a></h2><p>Example 1: Generate a unique ID with default length (6 characters) using <code>await</code>.</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> inputs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;user123&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;photo.png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> generateUniqueId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(inputs);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(id); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Outputs: &#39;a1b2c3&#39; (example result)</span></span></code></pre></div><p>Example 2: Generate a unique ID with a custom length (16 characters).</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> inputs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;session456&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;document.pdf&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;additionalInfo&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> customBias</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;customRandomBias123&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> customLength</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> generateUniqueId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(inputs, customBias, customLength);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(id); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Outputs: &#39;1a2b3c4d5e6f7g8h&#39; (example result)</span></span></code></pre></div><p>Example 3: Generate a unique ID in an environment without <code>crypto.subtle.digest</code>.</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> inputs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;user123&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;file.txt&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> generateUniqueId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(inputs);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(id); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Outputs: &#39;abc123def456&#39; (example random result)</span></span></code></pre></div><h2 id="defined-in" tabindex="-1">Defined in <a class="header-anchor" href="#defined-in" aria-label="Permalink to &quot;Defined in&quot;">​</a></h2><p><a href="https://github.com/ZL-Asica/React/blob/6d4580b8bc1c67315cb918db84f8e80f948c4e85/src/utils/stringUtils.ts#L166" target="_blank" rel="noreferrer">utils/stringUtils.ts:166</a></p>`,32)]))}const g=i(n,[["render",h]]);export{c as __pageData,g as default};