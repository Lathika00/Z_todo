# Challenge 1 — Technical Questions

## Question 1: Number Pattern

**Problem:** Given `n`, print:

```
1
21
321
4321
...
```

Each row `i` contains digits from `i` down to `1`.

**Runnable code:** [`q1-pattern.js`](./q1-pattern.js)

### Four approaches

| Approach | Technique |
|----------|-----------|
| 1 | Nested `for` loops — build each line digit by digit |
| 2 | `Array.from` + `join` — declarative row construction |
| 3 | Recursion — one row per recursive call |
| 4 | `reduce` — accumulate digits into a string per row |

Run: `node challenge-1/q1-pattern.js`

---

## Question 2: Reverse a String

**Input:** `"Bhaskara"` → **Output:** `"araksahB"`

**Runnable code:** [`q2-reverse-string.js`](./q2-reverse-string.js)

### Five approaches

| Approach | Technique |
|----------|-----------|
| 1 | `split('').reverse().join('')` |
| 2 | `for` loop from end to start |
| 3 | `reduce` — prepend each character |
| 4 | Recursion — last char + reverse of rest |
| 5 | `Array.from(str).reverse().join('')` |

Run: `node challenge-1/q2-reverse-string.js`

---

## Question 3: Remove Duplicates from Array

**Input:** `[1, 2, 3, 6, 4, 3, 7, 4, 2, 6, 8, 2, 5, 9, 0, 1]`  
**Output:** `[1, 2, 3, 6, 4, 7, 8, 5, 9, 0]` (first occurrence preserved)

**Runnable code:** [`q3-remove-duplicates.js`](./q3-remove-duplicates.js)

### Five approaches

| Approach | Technique |
|----------|-----------|
| 1 | `[...new Set(arr)]` |
| 2 | `filter` + `indexOf` |
| 3 | `reduce` with a `Set` tracker |
| 4 | `for...of` + `includes` |
| 5 | `Map` keyed by value |

Run: `node challenge-1/q3-remove-duplicates.js`

---

## Question 4: CSS Selector Analysis

**HTML structure:**

```html
01 <div id="container">
02    <div class="box"></div>
03
04    <div class="box2"></div>
05    <div>
06        <div class="box"></div>
07    </div>
08 </div>
09
10 <div class="box"></div>
```

### `.box`

| Selected lines | 2, 6, 10 |
|----------------|----------|

**Why selected:** Matches every element whose `class` attribute contains `box`.

**Why not others:** Line 4 has class `box2`, not `box`. Lines 1, 5, 7, 8, 9 have no `box` class.

---

### `div .box`

| Selected lines | 2, 6, 10 |
|----------------|----------|

**Why selected:** Selects elements with class `box` that are **descendants** of a `div`. All three `.box` elements sit inside a `div` ancestor (lines 1, 5, or 10).

**Why not others:** Same as `.box` here — every `.box` happens to be nested inside a `div`, so results match `.box`.

---

### `div.box`

| Selected lines | 2, 6, 10 |
|----------------|----------|

**Why selected:** Selects `div` elements that **also** have class `box`. All three `.box` elements are `<div>` tags.

**Why not others:** Line 4 is a `div` but has class `box2`, not `box`.

---

### `[class]`

| Selected lines | 2, 4, 6, 10 |
|----------------|-------------|

**Why selected:** Matches any element with a `class` attribute, regardless of value.

**Why not others:** Lines 1, 5, 7, 8 have no `class` attribute. Line 9 is blank.

---

### `#container .box`

| Selected lines | 2, 6 |
|----------------|------|

**Why selected:** `.box` elements that are **descendants** of `#container` (line 1).

**Why not line 10:** Line 10's `.box` is outside `#container` — it is a sibling, not a descendant.

**Why not line 4:** `box2` ≠ `box`.

---

### `#container > .box`

| Selected lines | 2 only |
|----------------|--------|

**Why selected:** Direct **child** of `#container` with class `box`. Line 2 is the only `.box` that is an immediate child of `#container`.

**Why not line 6:** Line 6's `.box` is nested inside the `div` on line 5, which is the direct child of `#container` — so line 6 is a **grandchild**, not a direct child.

**Why not line 10:** Outside `#container`.

---

## Question 5: Three-Box Horizontal Layout

**Requirements:**
- Left box: fixed 100px, left-aligned
- Right box: fixed 100px, right-aligned
- Middle box: fills remaining width
- No overlap when container resizes

**Demo:** [`q5-layout.html`](./q5-layout.html) — open in a browser to compare all three approaches.

### Approach 1: Flexbox (recommended)

```css
.container {
  display: flex;
  align-items: stretch;
  gap: 0;
  width: 100%;
  min-height: 80px;
}

.left.fixed.box {
  flex: 0 0 100px;
}

.middle.box {
  flex: 1 1 auto;
  min-width: 0; /* prevents flex overflow */
}

.right.fixed.box {
  flex: 0 0 100px;
  margin-left: auto; /* pushes to the right in flex row */
}
```

With three siblings in order (left, middle, right), `margin-left: auto` on the right box is optional if order is already correct — `flex: 1` on middle absorbs all free space.

### Approach 2: CSS Grid

```css
.container {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  width: 100%;
  min-height: 80px;
}

.left.fixed.box,
.right.fixed.box,
.middle.box {
  min-width: 0;
  overflow: hidden;
}
```

Grid explicitly defines column tracks: `100px | flexible | 100px`.

### Approach 3: Float + overflow hidden (classic)

```css
.container {
  overflow: hidden; /* clearfix */
  width: 100%;
}

.left.fixed.box {
  float: left;
  width: 100px;
}

.right.fixed.box {
  float: right;
  width: 100px;
}

.middle.box {
  margin-left: 100px;
  margin-right: 100px;
  overflow: hidden;
}
```

Middle box uses side margins equal to fixed column widths so content never slides under the floated boxes.
