
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, TemplateRef } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { DentalChartService } from 'src/app/_services/dentalchart.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { Actions, ProceduresInfo } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
/**
 * Node for to-do item
 */
export class ProcedureCodeNode {
  children: ProcedureCodeNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class ProcedureCodeFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}
/**
 * database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ProviderCodeDatabase {
  dataChange = new BehaviorSubject<ProcedureCodeNode[]>([]);

  get data(): ProcedureCodeNode[] {
    return this.dataChange.value;
  }

  constructor(private dentalService: DentalChartService) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `ProcedureCodeNode` with nested
    //     file node as children.
    //const data = this.buildFileTree(TREE_DATA, 0);
    this.dentalService.ProcedureCodesJSON().subscribe(resp => {
      if (resp.IsSuccess) {
        //let database = new ProviderCodeDatabase(JSON.parse(resp.Result));
        const data = this.buildFileTree(JSON.parse(resp.Result), 0);
        // Notify the change.
        this.dataChange.next(data);
      }
    })


  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `ProcedureCodeNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): ProcedureCodeNode[] {
    return Object.keys(obj).reduce<ProcedureCodeNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ProcedureCodeNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: ProcedureCodeNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as ProcedureCodeNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: ProcedureCodeNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-procedure',
  templateUrl: 'tree.procedure.component.html',
  styleUrls: ['tree.procedure.component.scss'],
  providers: [ProviderCodeDatabase],
})
export class TreeProcedureComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ProcedureCodeFlatNode, ProcedureCodeNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ProcedureCodeNode, ProcedureCodeFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: ProcedureCodeFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<ProcedureCodeFlatNode>;

  treeFlattener: MatTreeFlattener<ProcedureCodeNode, ProcedureCodeFlatNode>;

  dataSource: MatTreeFlatDataSource<ProcedureCodeNode, ProcedureCodeFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ProcedureCodeFlatNode>(true /* multiple */);

  /** Current viewing patient is updated from view model*/
  currentPatient: ProviderPatient

  /**Procedure dialog to add new Procedure */
  procedureDialogComponent = ProcedureDialogComponent;

  /**
   *for which action is opened the dialog
   *
   * @memberof TreeProcedureComponent
   */
  ActionTypes = Actions

  constructor(private overlayService: OverlayService,
    private _database: ProviderCodeDatabase,
    private _authService: AuthenticationService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<ProcedureCodeFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: ProcedureCodeFlatNode) => node.level;

  isExpandable = (node: ProcedureCodeFlatNode) => node.expandable;

  getChildren = (node: ProcedureCodeNode): ProcedureCodeNode[] => node.children;

  hasChild = (_: number, _nodeData: ProcedureCodeFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: ProcedureCodeFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ProcedureCodeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new ProcedureCodeFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };


  /* Get the parent node of a node */
  getParentNode(node: ProcedureCodeFlatNode): ProcedureCodeFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.new,node:any = null) {
      let reqData: ProceduresInfo;
      if(dialogData == null){
        reqData = new ProceduresInfo();
        if(node != null){
          reqData.Code = node.item.substring(0,node.item.indexOf('-'));
          reqData.Description = node.item.substring(node.item.indexOf('-')+1);
        }
        reqData.ViewFrom = "Tree";
      }


    const ref = this.overlayService.open(content, reqData);

    ref.afterClosed$.subscribe(res => {
      if (content === this.procedureDialogComponent) {
        if (res.data != null) {

        }
      }
    });
  }
}
