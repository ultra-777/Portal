export enum MessageBoxType {
    ok,
    yesNo,
    yesNoCancel
}

export class MessageBoxContent {
    constructor(
        public body: string = '',
        public title: string = '',
        public type: MessageBoxType = MessageBoxType.ok,
        public okText: string = 'OK',
        public noText: string = 'NO',
        public cancelText: string = 'CANCEL'
    ) { }
}