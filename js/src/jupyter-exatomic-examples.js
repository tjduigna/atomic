// Copyright (c) 2015-2016, Exa Analytics Development Team
// Distributed under the terms of the Apache License 2.0
/*"""
=============
jupyter-exatomic-examples.js
=============
Example applications called when an empty container widget is rendered in a
Jupyter notebook environment.
*/

"use strict";
var base = require("./jupyter-exatomic-base.js");
var utils = require("./jupyter-exatomic-utils.js");
var App3D = require("./jupyter-exatomic-three.js").App3D;


var TestSceneModel = base.ExatomicSceneModel.extend({

    defaults: _.extend({}, base.ExatomicSceneModel.prototype.defaults, {
            _model_name: "TestSceneModel",
            _view_name: "TestSceneView"
    })

});


var TestUniverseSceneModel = base.ExatomicSceneModel.extend({

    defaults: _.extend({}, base.ExatomicSceneModel.prototype.defaults, {
        _model_name: "TestUniverseSceneModel",
        _view_name: "TestUniverseSceneView"
    })

});


var TestSceneView = base.ExatomicSceneView.extend({

    init: function() {
        base.ExatomicSceneView.prototype.init.apply(this);
        this.three_promises = this.app3d.finalize(this.three_promises)
            .then(this.add_geometry.bind(this))
            .then(this.app3d.set_camera_from_scene.bind(this.app3d));
    },

    add_surface: function() {
        this.app3d.clear_meshes("generic");
        if (this.model.get("geom")) {
            this.app3d.meshes["generic"] = this.app3d.add_parametric_surface();
        };
        this.app3d.add_meshes("generic");
    },

    add_geometry: function(color) {
        this.app3d.clear_meshes("generic");
        if (this.model.get("geom")) {
            this.app3d.meshes["generic"] = this.app3d.test_mesh();
        };
        this.app3d.add_meshes("generic");
    },

    add_field: function() {
        this.app3d.clear_meshes("field");
        this.app3d.meshes["field"] = this.app3d.add_scalar_field(
            utils.scalar_field(
                utils.gen_field_arrays(this.get_fps()),
                utils[this.model.get("field")]
            ), this.model.get("field_iso"));
        this.app3d.meshes["field"][0].name = this.model.get("field");
        this.app3d.add_meshes("field");
    },

    init_listeners: function() {
        base.ExatomicSceneView.prototype.init_listeners.call(this);
        this.listenTo(this.model, "change:geom", this.add_geometry);
        this.listenTo(this.model, "change:field", this.add_field);
    },

});


var TensorSceneModel = TestSceneModel.extend({

    defaults: function() {
        return _.extend({}, TestSceneModel.prototype.defaults, {
            _model_name: "TensorSceneModel",
            _view_name: "TensorSceneView",
            geom: true,
            field: "null",
            field_ml: 0
        })
    }

});



var TensorSceneView = TestSceneView.extend({
});



var TestUniverseSceneModel = base.ExatomicSceneModel.extend({

    defaults: _.extend({}, base.ExatomicSceneModel.prototype.defaults, {
        _model_name: "TestUniverseSceneModel",
        _view_name: "TestUniverseSceneView",
        field: "Hydrogenic",
        field_iso: 0.005,
        field_kind: "1s",
        field_ox: -30.0,
        field_oy: -30.0,
        field_oz: -30.0,
        field_fx: 30.0,
        field_fy: 30.0,
        field_fz: 30.0,
        field_nx: 31,
        field_ny: 31,
        field_nz: 31
    })

});


var TestUniverseSceneView = base.ExatomicSceneView.extend({

    init: function() {
        base.ExatomicSceneView.prototype.init.call(this);
        this.three_promises = this.app3d.finalize(this.three_promises)
            .then(this.add_field.bind(this))
            .then(this.app3d.set_camera_from_scene.bind(this.app3d));
    },

    add_field: function() {
        this.app3d.clear_meshes("field");
        var field = this.model.get("field");
        var kind = this.model.get("field_kind");
        var iso = this.model.get("field_iso");
        var fps = this.get_fps();
        var ars = utils.gen_field_arrays(fps);
        if (field === "SolidHarmonic") {
            var tf = utils[field](ars, kind, this.model.get("field_ml"));
        } else {
            var tf = utils[field](ars, kind);
        };
        var colors = {"pos": this.model.get("field_pos"),
                      "neg": this.model.get("field_neg")};
        this.app3d.meshes["field"] = this.app3d.add_scalar_field(tf, iso, 2, colors);
        this.app3d.add_meshes("field");
    },

    init_listeners: function() {
        base.ExatomicSceneView.prototype.init_listeners.call(this);
        this.listenTo(this.model, "change:field_kind", this.add_field);
        this.listenTo(this.model, "change:field_ml", this.add_field);
    },

});


var TestContainerModel = base.ExatomicBoxModel.extend({
    defaults: _.extend({}, base.ExatomicBoxModel.prototype.defaults, {
        _model_name: "TestContainerModel",
        _view_name: "TestContainerView"
    })
});

var TestContainerView = base.ExatomicBoxView.extend({});


var TensorContainerModel = TestContainerModel.extend({
    defaults: _.extend({}, TestContainerModel.prototype.defaults, {
        _model_name: "TensorContainerModel",
        _view_name: "TensorContainerView"
    })
});

var TensorContainerView = TestContainerView.extend({});



var TestUniverseModel = base.ExatomicBoxModel.extend({
    defaults: _.extend({}, base.ExatomicBoxModel.prototype.defaults, {
        _model_name: "TestUniverseModel",
        _view_name: "TestUniverseView"
    })
});

var TestUniverseView = base.ExatomicBoxView.extend({});


module.exports = {
    TestUniverseSceneModel: TestUniverseSceneModel,
    TestUniverseSceneView: TestUniverseSceneView,
    TestUniverseModel: TestUniverseModel,
    TestUniverseView: TestUniverseView,
    TestSceneModel: TestSceneModel,
    TestSceneView: TestSceneView,
    TensorSceneModel: TensorSceneModel,
    TensorSceneView: TensorSceneView,
    TensorContainerModel: TensorContainerModel,
    TensorContainerView: TensorContainerView
}
