

```
https://www.mocodo.net/?mcd=eNpVUstuwyAQvPMVfACH5uobdYmD3OAKO5VyQsSmDapjW4Db5u_Lw04TIZlh8czuzpKBbFnghjzGh2ZHWENz3JAawScGDzXhCG42kJMtJ_VONFVJGHg4wQzqDkE3fqkBQW3trDohHYLqd9JGWY9BXrEtLQ4cN7RiWfhdDc5cxWR0qxBs5SRb7a4IWifdbBEcJzXo4VOcx9lYgPOGvtPmGJmDvHhKp2xr9OT06JNOunWzUSsd7HAqf-XFQ-iqqPgRrCCq9fKk-nsXvA-h63D5oY11IuXr5Q2qi9Q9gidt3Fl00vnQJK39GY3XM2OvwB6XwUDv23NVlZQVNzPBEoi512b9blyybEjWdbORoTVQEEZ4GodX86MpSeMhW4VBCqUReLOV-Y5EMcwXZf5TRKPjvHFd04JFuTRdXxmvXgkIn6STPAlW5DvMiuUtvHGaE7GvXuiWLryUHDzewDuRUFM3t6GiPwkwuio=




```




```


:
:
:
:
:


:
:
:
:
:

AUTHENTICATES, 0N USER, 11 REFRESH_TOKEN
REFRESH_TOKEN : id, token, issued_at, expires_at
CONFIGURATION:id, entry_price, capacity, status, opening_hours
ACTIVITY:id, name, description, picture, status
HAS, 0N ACTIVITY, 0N CATEGORY
CATEGORY:id, label

:
:
:
:
:
:

USER:id,first_name, last_name, email, birth_date, password, role
MAKES, 11 BOOKING, 0N USER
BOOKING:id, status, start_at, end_at, duration
GENERATES, 11 TICKET, 1N BOOKING
TICKET: id, reservation_numer, status, price
:


ASSIGN, 11 USER, 0N ROLE
ROLE: id, label
:
:
CHANGES, 0N PRICE_MODIFIER, 0N TICKET
PRICE_MODIFIER : id, label, reduction


```