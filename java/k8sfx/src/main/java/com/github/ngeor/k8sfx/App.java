package com.github.ngeor.k8sfx;

import com.github.ngeor.kubeconfig.KubeConfig;
import com.github.ngeor.kubeconfig.KubeConfigParser;
import java.io.IOException;
import java.util.Objects;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeView;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;


/**
 * JavaFX App
 */
public class App extends Application {

    @Override
    public void start(Stage stage) {
        var javaVersion = SystemInfo.javaVersion();
        var javafxVersion = SystemInfo.javafxVersion();

        KubeConfig kubeConfig;
        try {
            kubeConfig = new KubeConfigParser().parse();
        } catch (IOException e) {
            e.printStackTrace();
            kubeConfig = new KubeConfig();
        }

        TreeItem<String> root = new TreeItem<>("Contexts");
        root.setExpanded(true);

        for (var context : kubeConfig.getContexts()) {
            boolean isCurrent = Objects.equals(kubeConfig.getCurrentContext(), context.getName());
            String label = isCurrent ? "* " + context.getName() : context.getName();
            TreeItem<String> treeItem = new TreeItem<>(label);
            root.getChildren().add(treeItem);
        }
        TreeView<String> treeView = new TreeView<>(root);

        var label = new Label("Hello, JavaFX " + javafxVersion + ", running on Java " + javaVersion + ".");

        BorderPane borderPane = new BorderPane();
        borderPane.setTop(label);
        borderPane.setCenter(treeView);
        // TODO add clusters, contexts, users and current-context

        var scene = new Scene(borderPane, 640, 480);
        stage.setScene(scene);
        stage.setTitle("fxdemo");
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }

}
