import getAndReplaceTriggers from './getAndReplaceTriggers';

// get the cursor position from .editor start
const getCursorPosition = (parent, node, offset, stat) => {
  if (stat.done) return stat;

  let currentNode = null;
  if (parent.childNodes.length == 0) {
    stat.pos += parent.textContent.length;
  } else {
    for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      if (currentNode === node) {
        stat.pos += offset;
        stat.done = true;
        return stat;
      } else getCursorPosition(currentNode, node, offset, stat);
    }
  }
  return stat;
};

//find the child node and relative position and set it on range
const setCursorPosition = (parent, range, stat) => {
  if (stat.done) return range;

  let currentNode = null;

  if (parent.childNodes.length == 0) {
    if (parent.textContent.length >= stat.pos) {
      range.setStart(parent, stat.pos);
      stat.done = true;
    } else {
      stat.pos = stat.pos - parent.textContent.length;
    }
  } else {
    for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
      currentNode = parent.childNodes[i];
      setCursorPosition(currentNode, range, stat);
    }
  }
  return range;
};

async function handleSelectionAndReplaceTriggers() {
  const editor = document.activeElement;

  const sel = window.getSelection();
  const node = sel.focusNode;
  const offset = sel.focusOffset;
  const pos = getCursorPosition(editor, node, offset, { pos: 0, done: false });

  if (offset === 0) pos.pos += 0.5;

  const shouldResetCursor = await getAndReplaceTriggers();

  if (!shouldResetCursor) return;

  // restore the position
  sel.removeAllRanges();
  const range = setCursorPosition(editor, document.createRange(), {
    pos: pos.pos,
    done: false,
  });
  range.collapse(true);
  sel.addRange(range);
}

export default handleSelectionAndReplaceTriggers;
