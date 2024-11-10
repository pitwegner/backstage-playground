import { DependencyGraphTypes } from '@backstage/core-components';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { EntityNodeData } from '@backstage/plugin-catalog-graph';
import { EntityKindIcon } from './EntityKindIcon';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';

const useStyles = makeStyles(
  theme => ({
    node: {
      fill: theme.palette.grey[300],
      stroke: theme.palette.grey[300],

      '&.primary': {
        fill: theme.palette.primary.light,
        stroke: theme.palette.primary.light,
      },
      '&.secondary': {
        fill: theme.palette.secondary.light,
        stroke: theme.palette.secondary.light,
      },
      '&.API': {  //Dunkelgrün
        fill: '#587948',
        stroke: '#587948',
      },
      '&.Component': {  //Orange
        fill: '#ce7e00',
        stroke: '#ce7e00',
      },
      '&.Resource': {  //Dunkelblau
        fill: '#4b76a8',
        stroke: '#4b76a8',
      },
      '&.Group': {  //Braun
        fill: '#412800',
        stroke: '#412800',
      },
      '&.System': {  //Hellgrün
        fill: '#c7faaf',
        stroke: '#c7faaf',
      },
      '&.Location': {
        fill: theme.palette.primary.light,
        stroke: theme.palette.primary.light,
      },
    },
    text: {
      fill: theme.palette.getContrastText(theme.palette.grey[300]),

      '&.primary': {
        fill: theme.palette.primary.contrastText,
      },
      '&.secondary': {
        fill: theme.palette.secondary.contrastText,
      },
      '&.focused': {
        fontWeight: 'bold',
      },
    },
    clickable: {
      cursor: 'pointer',
    },
  }),
  { name: 'PluginCatalogGraphCustomNode' },
);

export function CustomNode({
  node: { id, entity, color = 'default', focused, onClick },
}: DependencyGraphTypes.RenderNodeProps<EntityNodeData>) {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const idRef = useRef<SVGTextElement | null>(null);

  useLayoutEffect(() => {
    // set the width to the length of the ID
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);

  const {
    kind,
    metadata: { name, namespace = DEFAULT_NAMESPACE, title },
  } = entity;

  const padding = 10;
  const iconSize = height;
  const paddedIconWidth = kind ? iconSize + padding : 0;
  const paddedWidth = paddedIconWidth + width + padding * 2;
  const paddedHeight = height + padding * 2;

  const displayTitle =
    title ??
    (kind && name && namespace
      ? humanizeEntityRef({ kind, name, namespace })
      : id);

  return (
    <g onClick={onClick} className={classNames(onClick && classes.clickable)}>
      <rect
        className={classNames(
          classes.node,
          color === 'primary' && kind,
          color === 'secondary' && 'secondary',
        )}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      {kind && (
        <EntityKindIcon
          kind={kind}
          y={padding}
          x={padding}
          width={iconSize}
          height={iconSize}
          className={classNames(
            classes.text,
            focused && 'focused',
            color === 'primary' && 'primary',
            color === 'secondary' && 'secondary',
          )}
        />
      )}
      <text
        ref={idRef}
        className={classNames(
          classes.text,
          focused && 'focused',
          color === 'primary' && 'primary',
          color === 'secondary' && 'secondary',
        )}
        y={paddedHeight / 2}
        x={paddedIconWidth + (width + padding * 2) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {displayTitle}
      </text>
    </g>
  );
}