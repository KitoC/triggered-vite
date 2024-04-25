const BLUR = 'blur(25px)';

const replaceAllInstances = async trggrInstance => {
  let shouldResetCursor = false;
  const {
    trggr,
    dtrggr,
    //  prev_dtrggr,
    blur_images,
    remove_links,
  } = trggrInstance;
  const regex = new RegExp(`(${trggr})(s)?('s)?(’s)?`, 'gi');
  // const prevRegex = new RegExp(`(${prev_dtrggr})(s)?('s)?(’s)?`, 'gi');

  const linksIncluding = {};

  replaceInText(document.body);
  replaceInText(document.body);

  function replaceInText(element) {
    for (const node of element.childNodes) {
      const isLink = node.tagName === 'A';

      if (remove_links && isLink && node?.href.toLowerCase().match(regex)) {
        // node.parentNode.removeChild(node);
      }

      if (blur_images && isLink && node?.innerHTML.toLowerCase().match(regex)) {
        linksIncluding[node?.href] = true;
      }

      if (blur_images && node.tagName === 'IMG' && node?.alt.toLowerCase().match(regex) && node.style.filter !== BLUR) {
        node.style.filter = BLUR;
        shouldResetCursor = true;
      }

      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          replaceInText(node);
          break;
        case Node.TEXT_NODE:
          if (node.textContent.match(regex)) {
            node.textContent = node.textContent.replace(regex, dtrggr);
            shouldResetCursor = true;
          }
          break;
        case Node.DOCUMENT_NODE:
          replaceInText(node);
      }
    }
  }

  Object.keys(linksIncluding).forEach(href => {
    const url = href.replace(/^.*\/\/[^/]+/, '');

    [...document.querySelectorAll(`a[href='${url}']`), ...document.querySelectorAll(`a[href='${href}']`)].forEach(
      tag => {
        for (const img of tag.getElementsByTagName('img')) {
          if (img.style.filter !== BLUR) {
            img.style.filter = BLUR;
            shouldResetCursor = true;
          }
        }
      },
    );
  });

  return shouldResetCursor;
};

export default replaceAllInstances;
