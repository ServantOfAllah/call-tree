import { Contacts } from '../../pages/models/contacts'
import { Groups } from '../../pages/models/groups'

const mainList: Contacts[] = [
    { groupsname:['family', 'friends'], firstname: 'abdulmajid', lastname: 'adams', phoneNo: 123 },
    { groupsname:['family', 'friends'], firstname: 'john', lastname: 'doe', phoneNo: 456 },
    { groupsname:['family', 'friends'], firstname: 'mary', lastname: 'dark', phoneNo: 789 },
]

const contactList: Groups[] = [
    {contactsGroup: mainList[0]},
    {contactsGroup: mainList[1]},
]

export const CONTACT_LIST = contactList