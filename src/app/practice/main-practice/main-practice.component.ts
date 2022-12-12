import { Component, OnInit } from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { Router } from '@angular/router';


interface TopicNode {
  name: string;
  route?: string;
  children?: TopicNode[];
  tooltip?: {
    icon: string;
    content: string;
  }
}

const TREE_DATA: TopicNode[] = [
  {
    name: 'About', route: 'about'
  },
  {
    name: 'MEAN',
    children: [
      {name: 'Post Creator', route: 'posts'},
      {name: 'Image Upload', route: 'image-upload'},
    ],
    tooltip: {
      icon: 'help',
      content: 'MongoDB, Express, Angular, NodeJS'
    }
  },
  {
    name: 'Authentication',
    children: [
      {name: 'Login', route: 'login'},
      {name: 'Sign Up', route: 'signup'},
    ],
  },
];


@Component({
  selector: 'app-main-practice',
  templateUrl: './main-practice.component.html',
  styleUrls: ['./main-practice.component.css']
})
export class MainPracticeComponent implements OnInit {

  treeControl = new NestedTreeControl<TopicNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TopicNode>();

  constructor(private router: Router) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {

    this.dataSource.data.forEach((n) => {
      if (!!n.children && !!n.children.find(c => this.isNodeSelected(c))) {
        this.treeControl.expand(n);
      }
    })
  }

  hasChild = (_: number, node: TopicNode) => !!node.children && node.children.length > 0;

  isNodeSelected(node: TopicNode): boolean {
    return !!node.route && this.router.url.includes(node.route);
  }
}