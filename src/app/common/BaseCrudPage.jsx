import React from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import Card from "app/modules/card/Card";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import RemoteEndPoint from "robe-react-commons/lib/endpoint/RemoteEndPoint";
import Store from "robe-react-commons/lib/stores/Store";
import NotificationManager from "react-notifications/lib/NotificationManager";


export default class BaseCrudPage extends ShallowComponent {

    static propTypes: Map = {
        url: React.PropTypes.string,
        idField: React.PropTypes.string,
        fields: React.PropTypes.array,
        toolbar: React.PropTypes.array,
        description: React.PropTypes.string,
        header: React.PropTypes.string,
        modalHeader: React.PropTypes.string,
        searchable: React.PropTypes.string
    };

    constructor(props: Object) {
        super(props);
        var data = this.props.data;
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: data.url
            }),
            idField: data.idField,
            autoLoad: true
        });
        this.state = {
            fields: data.fields,
            header: data.header,
            description: data.description,
            toolbar: data.toolbar || ["create", "edit", "delete"],
            modalHeader: data.modalHeader,
            store: store,
            showModal: false,
            searchable: data.searchable || false,
            propsOfFields: data.propsOfFields || {},
            resources: data.resources
        };
    }

    render(): Object {

        return (
            <Card description={this.state.description} header={this.state.header} {...this.props}>
                <DataGrid
                    fields={this.state.fields}
                    store={this.state.store}
                    ref={"table"}
                    toolbar={this.state.toolbar}
                    onNewClick={this.__add}
                    onEditClick={this.__edit}
                    onDeleteClick={this.__remove}
                    onSelection={this.__onClickRow}
                    pageable={true}
                    searchable={this.state.searchable}
                    editable={true}
                    pagination={{ emptyText: "No data.", pageSize: 20 }}
                    modalConfirm={{
                    header: "Silmek istediğine emin misin ?",
                    message:"Silinen kayıt tamamen kaybolacaktır.",
                    okButtonText:"Evet",
                    cancelButtonText:"Vazgeç" }}
                    refreshable={true}
                    pageSizeButtons={["5", "10", "50"]}
                    resources={this.state.resources}
                />
                <ModalDataForm
                    ref="detailModal"
                    header={this.state.modalHeader}
                    show={this.state.showModal}
                    onSubmit={this.__onSave}
                    onCancel={this.__onCancel}
                    item={this.state.item}
                    fields={this.state.fields}
                    propsOfFields={this.state.propsOfFields}
                    resources={this.state.resources}

                />
            </Card>
        );
    }

    __add = () => {
        let empty = {};
        this.__showModal(empty);
    };

    __edit = () => {
        let selectedRows = this.refs.table.getSelectedRows();
        if (!selectedRows || !selectedRows[0]) {
            return;
        }
        this.__showModal(selectedRows[0]);
    };

    __onCancel = () => {
        this.setState({showModal: false});
    };

    __onSave = (newData: Object, callback: Object) => {
        this.state.store.create(newData, this.__onSuccess, this.__onError);
    };

    __onSuccess = ()=> {
        this.__onCancel();
        NotificationManager.success("Başarı ile kaydedildi");
        this.refs.detailModal.doNotSubmit = false;
    };
    __onError = (res)=> {
        this.refs.detailModal.doNotSubmit = false;
        if(res.message == "Conflicts connections"){
            NotificationManager.error("Daha önce kaydedilmiş sadece düzenleme ve silme yapabilirsiniz.")
        }
    };

    __remove = () => {
        if (this.props.onDeleteClick) {
            this.props.onDeleteClick();
        }
        let selectedRows = this.refs.table.getSelectedRows();
        this.state.store.delete(selectedRows[0], ()=> {
            NotificationManager.success("Başarı ile silindi");
        });
    };

    __showModal = (newItem: Object) => {
        this.setState({showModal: true, item: newItem});
    };

    __onClickRow = (data)=> {
        if (this.props.onClickRow) {
            this.props.onClickRow(data);
        }
    };

    refreshTable = (state)=> {
        this.refs.table.__onFilterChanged(state);
    };

    readData = ()=> {
        this.refs.table.__readData();
    };

}