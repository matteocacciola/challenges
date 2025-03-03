import {Knex} from 'knex'

const connection = require('../../knexfile')
export const KnexConnection: Knex = require('knex')(connection)