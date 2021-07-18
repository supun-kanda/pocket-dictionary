const GET_WORDS_WITH_SYNONYMS_BY_USER_ID = `
select
	w.id as "key",
	w."key" as word,
	w.meaning,
	w.frequency as "views",
	s1.secondary_id as s1,
	s2.primary_id as s2
from
	words w
left join synonym s1 on
	s1.primary_id = w.id
left join synonym s2 on
	s2.secondary_id = w.id
where
	"owner" = $1
order by
	(w.frequency,
	w."key") asc`
const GET_USER_BY_EMAIL = `select id from "user" where email = $1`;
const GET_USER_BY_USER_ID = `select id, email, "name" from "user" where id = $1`;
const GET_SYNONYMS_BY_WORD_ID = `
select s1.secondary_id from synonym s1 where s1.primary_id = $1
union
select s2.primary_id from synonym s2 where s2.secondary_id = $1`;

const INSERT_USER = `
insert into "user"
    (email,"name",created_ts)
values
    ($1, $2, now()) returning *`;
const INSERT_WORD = `
insert into words 
    ("key", meaning, created_ts, "owner", frequency)
values
    ($1, $2, now(), $3, 1) returning *`;
const INSERT_SYNONYMS_BY_WORD_ID = `
insert into synonym (primary_id, secondary_id, created_ts) values ($1, $2, now())`;

const DELETE_WORDS_BY_USER_ID = `delete from words where "owner" = $1`;
const DELETE_USER_BY_USER_ID = `delete from "user" where id = $1`;
const DELETE_WORD_BY_WORD_ID = `delete from words where id = $1`;
const DELETE_SYNONYM_BY_WORD_ID = `delete from synonym where primary_id = $1 or secondary_id = $1`;
const DELETE_SYNONYMS_BY_USER_ID = `
delete
from
	synonym s
		using words w
where
	w."owner" = $1
	and (w.id = s.primary_id
	or w.id = s.secondary_id)`;
const DELETE_SYNONYM_ENTRY = `
delete
from
	synonym
where
	(primary_id = $1
		and secondary_id = $2)
	or (primary_id = $2
		and secondary_id = $1)`

const UPDATE_WORD = `update words set "key"=$1, meaning=$2 where id=$3`;
const RESET_VIEW_COUNT = `update words set frequency=1 where id = $1`
const INCREMENT_VIEW_COUNT = `update words set frequency=frequency+1 where id = $1`
module.exports = {
    GET_WORDS_WITH_SYNONYMS_BY_USER_ID,
    GET_USER_BY_EMAIL,
    INSERT_USER,
    INSERT_WORD,
    DELETE_WORDS_BY_USER_ID,
    DELETE_USER_BY_USER_ID,
    GET_USER_BY_USER_ID,
    GET_SYNONYMS_BY_WORD_ID,
    INSERT_SYNONYMS_BY_WORD_ID,
    DELETE_WORD_BY_WORD_ID,
    DELETE_SYNONYM_BY_WORD_ID,
    DELETE_SYNONYMS_BY_USER_ID,
    UPDATE_WORD,
    RESET_VIEW_COUNT,
    INCREMENT_VIEW_COUNT,
    DELETE_SYNONYM_ENTRY,
}