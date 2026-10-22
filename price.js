// Полная страница: данные и формат цен берутся только из catalog.js.
'use strict';
const fullPrice = document.querySelector('#full-price');
const priceNavigation = document.querySelector('#price-navigation');
function element(tag, text, className) {
 const node = document.createElement(tag);
 if (text) node.textContent = text;
 if (className) node.className = className;
 return node;
}
(window.SPECIALISTS || []).forEach((person, index) => {
 const link = element('a', person.name);
 link.href = `#${person.id}`;
 if (index) priceNavigation.append(document.createTextNode(' · '));
 priceNavigation.append(link);
 const heading = element('h2', person.bookingName);
 heading.id = person.id;
 fullPrice.append(heading);
 person.groups.forEach(group => {
  const section = element('section');
  section.append(element('h3', group.title));
  if (group.description) section.append(element('p', group.description));
  group.items.forEach(row => {
   const item = element('div', '', 'price-row');
   const info = element('div');
   info.append(element('h4', row.name));
   if (row.detail) info.append(element('small', row.detail));
   item.append(info, element('strong', window.formatPrice(row)));
   section.append(item);
  });
  fullPrice.append(section);
 });
});
