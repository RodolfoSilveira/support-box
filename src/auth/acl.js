import Acl from 'acl'
import AclSeq from 'sequelize-acl'
import db from '../app/models'

const acl = new Acl(new AclSeq(db.sequelize, { prefix: 'acl_' }))

export default acl
